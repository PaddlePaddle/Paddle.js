describe('e2e test custom model', () => {
    const { paddlejsCore } = require('./global.d.ts');
    const modelConfig = require('../dist/assets/models/custom_model/config.json');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL);
    });

    it('check predict data', async () => {
        const modelPath = `${CUR_URL}/assets/models/custom_model/model.json`;
        const modelInfo = {
            modelPath,
            ...modelConfig
        };

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        const res = await page.evaluate(async modelInfo => {
            const runner = new paddlejsCore.Runner(modelInfo);
            const preheatRes = await runner.init();
            return preheatRes;
        }, modelInfo);

        const expected = [42, 35, 56, 43, 38, 60];
        await expect(res).toEqual(expected);
    });
});