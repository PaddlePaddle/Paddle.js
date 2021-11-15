describe('e2e test ocr model', () => {
    const { paddlejs } = require('./global.d.ts');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL);
    });

    it('ocr predict', async () => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        const res = await page.evaluate(async () => {
            const word = document.querySelector('#ocr');
            const ocr = paddlejs['ocr'];
            await ocr.load();
            const res = await ocr.recognition(word);

            return res;
        });

        const expected = '韩国小馆';
        await expect(res.text[0]).toEqual(expected);
    });
});
