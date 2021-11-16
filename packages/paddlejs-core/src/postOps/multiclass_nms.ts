import { reshape } from '../opFactory/utils';

function getMaxScore(scores, threshold, topK) {
    const maxScores = [];
    for (let i = 0, len = scores.length; i < len; i++) {
        const score = scores[i];
        if (score > threshold) {
            maxScores.push({ score, i });
        }
    }
    return maxScores.sort((a, b) => b.score - a.score).slice(0, topK);
}

function getBoxArea(box) {
    const [x1, y1, x2, y2] = box;
    return (x2 - x1) * (y2 - y1);
}

function getIntersection(box1, box2) {
    const [x1, y1, x2, y2] = box1;
    const [x3, y3, x4, y4] = box2;
    const x11 = Math.max(x1, x3);
    const y11 = Math.max(y1, y3);
    const x22 = Math.min(x2, x4);
    const y22 = Math.min(y2, y4);
    return (x22 - x11) * (y22 - y11);
}


function calNMS(box1, box2) {
    if (box2[0] > box1[2]
        || box2[2] < box1[0]
        || box2[1] > box1[3]
        || box2[3] < box1[1]) {
        return 0;
    }
    const box1Area = getBoxArea(box1);
    const box2Area = getBoxArea(box2);
    const intersection = getIntersection(box1, box2);
    // 利用相交的面积和两个框自身的面积计算框的交并比, 将交并比大于阈值的框删除
    return (intersection / (box1Area + box2Area - intersection));
}

export default function compute(inputs, attrs) {
    // 目前只支持BBoxes: [N, M, 4]  Scores: [N，C，M]
    const [BBoxes = [], Scores = []] = inputs;
    // reshape适配
    let bbox = reshape(BBoxes);
    let scores = reshape(Scores);

    if (!bbox || !scores) {
        return [];
    }

    bbox = bbox[0];
    scores = scores[0];

    if (!bbox || !bbox.length || !scores || !scores.length) {
        return [];
    }

    const {
        nms_top_k = 100,
        nms_eta = 1,
        keep_top_k = 100
    } = attrs;

    let {
        background_label = 0,
        nms_threshold = 0.3,
        score_threshold = 0
    } = attrs;

    // 添加label
    const finalBox = [];
    for (let i = 0, len = scores.length; i < len; i++) {
        if (i === background_label) {
            continue;
        }
        // threshold, sort, slice
        const scoresMapList = getMaxScore(scores[i], score_threshold, nms_top_k);
        if (!scoresMapList || !scoresMapList.length) {
            return [];
        }
        const maxScoreMap = scoresMapList.shift();
        const maxIndice = maxScoreMap.i;
        const box1 = bbox[maxIndice];
        finalBox.push({ ...maxScoreMap, box: box1, label: i });

        for (const scoreMap of scoresMapList) {
            const index = scoreMap.i;
            const box1 = bbox[index];
            let keep = true;
            for (const { box: box2 } of finalBox) {
                // const box2 = bbox[index];
                if (calNMS(box1, box2) > nms_threshold) {
                    keep = false;
                    break;
                }
            }

            if (keep) {
                finalBox.push({ ...scoreMap, box: box1, label: index });
            }
            if (keep && nms_eta < 1 && nms_threshold > 0.5) {
                nms_threshold *= nms_eta;
            }
        }
    }

    const finalData = finalBox
        .sort((a, b) => b.score - a.score)
        .slice(0, keep_top_k)
        .map(item => [item.label, item.score, ...item.box]);
    return finalData && finalData.length ? finalData : [];
}
