import fetch from 'jest-fetch-mock';
import { Runner, registerBackend } from '../../src';
import Backend from '../env/mock/backend';

describe('test runnrer', () => {
    fetch.mockResponseOnce(JSON.stringify({
        data: 1
    }));
    const modelPath = 'https://paddlejs.cdn.bcebos.com/models/mobileNetV2Opt/model.json';
    registerBackend(
        'webgpu',
        new Backend()
    );
    const runner = new Runner({
        modelPath,
        feedShape: {
            fw: 5,
            fh: 3
        },
        fileCount: 4
    });
    it('test runner init', async () => {
        await runner.init();
        expect(runner.weightMap.length).toBe(68);
    });
});
