const detectResult = require('../dist/assets/detect.json');

describe('e2e test detect model', () => {
    const { paddlejs } = require('./global.d.ts');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL, {
            timeout: 0
        });
    });

    it('detect predict', async () => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        const res = await page.evaluate(async () => {
            const $detect = document.querySelector('#detect');
            const det = paddlejs['detect'];
            await det.init();
            const result = await det.detect($detect);
            return result;
        });
        const gap = 0.02;

        detectResult.forEach((item, index) => {
            // label 对比，若结果与预期不符，测试失败
            expect(item[0]).toEqual(res[index][0]);
            // 置信度对比，允许误差0.02
            expect(Math.abs(item[1] - res[index][1])).toBeLessThanOrEqual(gap);
            // 检测顶点坐标对比，允许误差0.02
            // left
            expect(Math.abs(item[2] - res[index][2])).toBeLessThanOrEqual(gap);
            // top
            expect(Math.abs(item[3] - res[index][3])).toBeLessThanOrEqual(gap);
            // right
            expect(Math.abs(item[4] - res[index][4])).toBeLessThanOrEqual(gap);
            // bottom
            expect(Math.abs(item[5] - res[index][5])).toBeLessThanOrEqual(gap);
        });
    });
});
