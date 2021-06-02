/* eslint-disable new-cap */
import clipper from 'js-clipper';
import NP from 'number-precision';
import cv from '@paddlejs-mediapipe/opencv/library/opencv';

const Polygon = require('d3-polygon');

export default class dbPostprocess {
    private thresh: number;
    private box_thresh: number;
    private max_candidates: number;
    private unclip_ratio: number;
    private score_mode: string;
    private dilation_kernel: null | number[];
    private min_size: number;
    private pred: number[];
    private segmentation: number[];
    private width: number;
    private height: number;

    constructor(result: number[], shape: number[]) {
        NP.enableBoundaryChecking(false);
        this.thresh = 0.3;
        this.box_thresh = 0.5;
        this.max_candidates = 1000;
        this.unclip_ratio = 1.6;
        this.score_mode = 'fast';
        this.dilation_kernel = null;
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
        const src = new cv.matFromArray(640, 640, cv.CV_8UC1, this.segmentation);
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        // 获取轮廓
        cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
        const num_contours = Math.min(contours.size(), this.max_candidates);
        const boxes = [];
        const scores = [];
        const arr = [];
        for (let i = 0; i < num_contours; i++) {
            const contour = contours.get(i);
            let { points, sside } = this.get_mini_boxes(contour);
            if (sside < this.min_size) {
                continue;
            }
            const score = this.box_score_fast(this.pred, points);
            if (this.box_thresh > score) {
                continue;
            }
            let box = this.unclip(points);
            const boxMap = new cv.matFromArray(box.length / 2, 1, cv.CV_32SC2, box);
            const resultObj = this.get_mini_boxes(boxMap);
            box = resultObj.points;
            sside = resultObj.sside;
            if (sside < this.min_size + 2) {
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
        const bounding_box = cv.minAreaRect(contour);
        const points = [];
        const mat = new cv.Mat();
        // 获取矩形的四个顶点坐标
        cv.boxPoints(bounding_box, mat);
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

        const sside = Math.min(bounding_box.size.height, bounding_box.size.width);
        mat.delete();

        return { points: box, sside };
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

        const mask = new cv.Mat.zeros(ymax - ymin + 1, xmax - xmin + 1, cv.CV_8UC1);
        box.forEach(item => {
            item[0] = Math.max(item[0] - xmin, 0);
            item[1] = Math.max(item[1] - ymin, 0);
        });
        const npts = 4;
        const point_data = new Uint8Array(box.flat());
        const points = cv.matFromArray(npts, 1, cv.CV_32SC2, point_data);
        const pts = new cv.MatVector();
        pts.push_back(points);
        const color = new cv.Scalar(255);
        // 多个多边形填充
        cv.fillPoly(mask, pts, color, 1);
        const sliceArr = [];
        for (let i = ymin; i < ymax + 1; i++) {
            sliceArr.push(...bitmap.slice(640 * i + xmin, 640 * i + xmax + 1));
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
                sum = NP.plus(sum, data[i]);
                length++;
            }
        }
        const num = NP.divide(sum, length);
        return num;
    }
}
/* eslint-enable new-cap */
