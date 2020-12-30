import fetch from 'jest-fetch-mock';
import Loader from '../../src/loader';
import modelInfo from '../env/mock/model.json';
import { ModelVar } from '../../src/commons/interface';

fetch.enableMocks();

describe('test loader', () => {

    it('test loader model ops', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify(modelInfo));
        const modelPath = 'https://mobileNetV2Opt/model.json';
        const loader = new Loader(modelPath, 0);
        const {
            ops
        } = await loader.load();
        expect(ops.length).toBe(7);
    });

    it('test loader fetch local model file', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify(modelInfo));
        const modelPath = '/path';
        const loader = new Loader(modelPath, 0);
        const {
            vars
        } = await loader.load();
        const op = vars.find(item => item.name === 'conv2d_0.w_0') as ModelVar;
        expect(op.shape).toEqual([3, 2, 2]);
    });

});
