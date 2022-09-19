import clipper from 'js-clipper';
import { enableBoundaryChecking, plus, divide } from 'number-precision';
import CV from '@paddlejs-mediapipe/opencv/library/opencv_ocr';

const Polygon = require('d3-polygon');

export default class DBPostprocess {
    private thresh: number;
    private box_thresh: number;
    private max_candidates: number;
    private unclip_ratio: number;
    private min_size: number;
    private pred: number[];
    private segmentation: number[];
    private width: number;
    private height: number;

    constructor(result: number[], shape: number[], thresh: number, box_thresh:number, unclip_ratio:number) {
        enableBoundaryChecking(false);
        this.thresh = thresh ? thresh : 0.3;
        this.box_thresh = box_thresh ? box_thresh : 0.66;
        this.max_candidates = 1000;
        this.unclip_ratio = unclip_ratio ? unclip_ratio:1.5;
        this.min_size = 3;
        this.width = shape[0];
        this.height = shape[1];
        this.pred = result;
        this.segmentation = [];
        this.pred.forEach((item: number) => {
            this.segmentation.push(item > this.thresh ? 255 : 0);
        });
    }

    public outputBox() {
        // eslint-disable-next-line new-cap
        const src = new CV.matFromArray(960, 960, CV.CV_8UC1, this.segmentation);
        const contours = new CV.MatVector();
        const hierarchy = new CV.Mat();
        // 获取轮廓
        CV.findContours(src, contours, hierarchy, CV.RETR_LIST, CV.CHAIN_APPROX_SIMPLE);
        const num_contours = Math.min(contours.size(), this.max_candidates);
        const boxes = [];
        const scores = [];
        const arr = [];
        for (let i = 0; i < num_contours; i++) {
            const contour = contours.get(i);
            let { points, side } = this.get_mini_boxes(contour);
            if (side < this.min_size) {
                continue;
            }
            const score = this.box_score_fast(this.pred, points);
            if (this.box_thresh > score) {
                continue;
            }
            let box = this.unclip(points);
            // eslint-disable-next-line new-cap
            const boxMap = new CV.matFromArray(box.length / 2, 1, CV.CV_32SC2, box);
            const resultObj = this.get_mini_boxes(boxMap);
            box = resultObj.points;
            side = resultObj.side;
            if (side < this.min_size + 2) {
                continue;
            }
            box.forEach(item => {
                item[0] = this.clip(Math.round(item[0]), 0, this.width);
                item[1] = this.clip(Math.round(item[1]), 0, this.height);
            });
            boxes.push(box);
            scores.push(score);
            arr.push(i);
            boxMap.delete();
        }
        src.delete();
        contours.delete();
        hierarchy.delete();
        return { boxes, scores };
    }

    private get_mini_boxes(contour) {
        // 生成最小外接矩形
        const bounding_box = CV.minAreaRect(contour);
        const points = [];
        const mat = new CV.Mat();
        // 获取矩形的四个顶点坐标
        CV.boxPoints(bounding_box, mat);
        for (let i = 0; i < mat.data32F.length; i += 2) {
            const arr = [];
            arr[0] = mat.data32F[i];
            arr[1] = mat.data32F[i + 1];
            points.push(arr);
        }
        function sortNumber(a, b) {
            return a[0] - b[0];
        }
        points.sort(sortNumber);

        let index_1 = 0;
        let index_2 = 1;
        let index_3 = 2;
        let index_4 = 3;
        if (points[1][1] > points[0][1]) {
            index_1 = 0;
            index_4 = 1;
        }
        else {
            index_1 = 1;
            index_4 = 0;
        }

        if (points[3][1] > points[2][1]) {
            index_2 = 2;
            index_3 = 3;
        }
        else {
            index_2 = 3;
            index_3 = 2;
        }

        const box = [
            points[index_1],
            points[index_2],
            points[index_3],
            points[index_4]
        ];

        const side = Math.min(bounding_box.size.height, bounding_box.size.width);
        mat.delete();

        return { points: box, side };
    }

    private box_score_fast(bitmap: number[], _box: number[]) {
        const h = this.height;
        const w = this.width;
        const box = JSON.parse(JSON.stringify(_box));
        const x = [] as number[];
        const y = [] as number[];
        box.forEach(item => {
            x.push(item[0]);
            y.push(item[1]);
        });
        // clip这个函数将将数组中的元素限制在a_min, a_max之间，大于a_max的就使得它等于 a_max，小于a_min,的就使得它等于a_min。
        const xmin = this.clip(Math.floor(Math.min(...x)), 0, w - 1);
        const xmax = this.clip(Math.ceil(Math.max(...x)), 0, w - 1);
        const ymin = this.clip(Math.floor(Math.min(...y)), 0, h - 1);
        const ymax = this.clip(Math.ceil(Math.max(...y)), 0, h - 1);
        // eslint-disable-next-line new-cap
        const mask = new CV.Mat.zeros(ymax - ymin + 1, xmax - xmin + 1, CV.CV_8UC1);
        box.forEach(item => {
            item[0] = Math.max(item[0] - xmin, 0);
            item[1] = Math.max(item[1] - ymin, 0);
        });
        const npts = 4;
        const point_data = new Uint8Array(box.flat());
        const points = CV.matFromArray(npts, 1, CV.CV_32SC2, point_data);
        const pts = new CV.MatVector();
        pts.push_back(points);
        const color = new CV.Scalar(255);
        // 多个多边形填充
        CV.fillPoly(mask, pts, color, 1);
        const sliceArr = [];
        for (let i = ymin; i < ymax + 1; i++) {
            sliceArr.push(...bitmap.slice(960 * i + xmin, 960 * i + xmax + 1));
        }
        const mean = this.mean(sliceArr, mask.data);
        mask.delete();
        points.delete();
        pts.delete();
        return mean;
    }

    private clip(data: number, min: number, max: number) {
        return data < min ? min : data > max ? max : data;
    }

    private unclip(box: number[]) {
        const unclip_ratio = this.unclip_ratio;
        const area = Math.abs(Polygon.polygonArea(box));
        const length = Polygon.polygonLength(box);
        const distance = area * unclip_ratio / length;
        const tmpArr = [];
        box.forEach(item => {
            const obj = {
                X: 0,
                Y: 0
            };
            obj.X = item[0];
            obj.Y = item[1];
            tmpArr.push(obj);
        });
        const offset = new clipper.ClipperOffset();
        offset.AddPath(tmpArr, clipper.JoinType.jtRound, clipper.EndType.etClosedPolygon);
        const expanded = [];
        offset.Execute(expanded, distance);
        let expandedArr = [];
        expanded[0] && expanded[0].forEach(item => {
            expandedArr.push([item.X, item.Y]);
        });
        expandedArr = [].concat(...expandedArr);
        return expandedArr;
    }

    private mean(data: number[], mask: number[]) {
        let sum = 0;
        let length = 0;
        for (let i = 0; i < data.length; i++) {
            if (mask[i]) {
                sum = plus(sum, data[i]);
                length++;
            }
        }
        const num = divide(sum, length);
        return num;
    }
}
