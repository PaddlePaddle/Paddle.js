const map = require('../dist/assets/map.json');

describe('e2e test mobilenet model', () => {
    const { paddlejs } = require('./global.d.ts');
    const CUR_URL = 'http://localhost:9898/';

    beforeAll(async () => {
        await page.goto(CUR_URL);
    });

    it('check predict data', async () => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        const res = await page.evaluate(async map => {
            const carImg = document.querySelector('#car');
            const catImg = document.querySelector('#banana');
            const path = 'https://paddlejs.cdn.bcebos.com/models/mobilenetV2_nchw';
            const mobilenet = paddlejs['mobilenet'];

            await mobilenet.load({
                path,
                mean: [0.485, 0.456, 0.406],
                std: [0.229, 0.224, 0.225]
            }, map);
            // classify car
            const carRes = await mobilenet.classify(carImg);
            // classify cat
            const catRes = await mobilenet.classify(catImg);

            return [carRes, catRes];
        }, map);

        const expected0 = 'sports car, sport car';
        const expected1 = 'banana';
        await expect(res[0]).toEqual(expected0);
        await expect(res[1]).toEqual(expected1);
    });
});