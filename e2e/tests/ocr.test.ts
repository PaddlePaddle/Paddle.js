const result = require('../dist/assets/ocr.json');

describe('e2e test ocr model', () => {
    const { paddlejs } = require('./global.d.ts');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL, {
            timeout: 0
        });
    });

    it('ocr predict', async () => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        const res = await page.evaluate(async () => {
            const $ocr = document.querySelector('#ocr');
            const ocr = paddlejs['ocr'];
            await ocr.init();
            const res = await ocr.recognize($ocr);
            return res.text;
        });
        // 模型文字识别结果与预期结果diff的字符数
        let diffNum = 0;
        // 预期文本内容
        const expectResult = result.text;
        // 预期字符diff数
        const expectedDiffNum = 2;

        expectResult && expectResult.forEach((item, index) => {
            const word = res[index];
            // 逐字符对比
            for (let i = 0; i < item.length; i++) {
                if (item[i] !== word[i]) {
                    console.log('expect: ', item[i], ' word: ', word[i]);
                    diffNum++;
                }
            }
        });
        expect(diffNum).toBeLessThanOrEqual(expectedDiffNum);
    });
});
