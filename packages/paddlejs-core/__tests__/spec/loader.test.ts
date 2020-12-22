import fetch from 'jest-fetch-mock';
import Loader from '../../src/loader';
import modelInfo from '../env/mock/model.json';

describe('test loader', () => {

    // enable fetch mock
    fetch.mockResponseOnce(JSON.stringify(modelInfo));
    const modelPath = 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2Opt/model.json';
    const loader = new Loader(modelPath, 4);

    it('test loader model ops', async () => {
        const {
            ops
        } = await loader.load();
        expect(ops.length).toBe(68);
    });

    it('test loader fetch chunk file', async () => {
        const {
            vars
        } = await loader.load();
        const op = vars.find(item => item.name === 'conv4_4_expand_weights');
        expect(op.data.length).toBe(24576);
    });
});
