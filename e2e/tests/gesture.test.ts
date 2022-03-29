describe('e2e test gesture model', () => {
    const { paddlejs } = require('./global.d.ts');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL, {
            timeout: 0
        });
    });

    it('gesture predict', async () => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        const res = await page.evaluate(async () => {
            const ok = document.querySelector('#ok');
            const gesture = paddlejs['gesture'];

            await gesture.load();
            const res = await await gesture.classify(ok);

            return res;
        });

        const expected = 'ok';
        await expect(res.type).toEqual(expected);
    });
});