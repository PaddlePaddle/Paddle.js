import fetch from 'jest-fetch-mock';
import { Runner, registerBackend } from '../../src';
import Backend from '../env/mock/backend';
import * as ops from '../env/mock/ops';
import modelInfo from '../env/mock/model.json';

// enabal mock fetch & return model.json
fetch.enableMocks();
fetch.resetMocks();
fetch.mockResponse(JSON.stringify(modelInfo));
const modelPath = 'https://mobileNetV2Opt/model.json';
const runner = new Runner({
    modelPath,
    feedShape: {
        fw: 5,
        fh: 3
    },
    fileCount: 0
});

it('test case: unregister backend', async () => {
    await runner.init();
    expect(runner.weightMap.length).toBe(0);
});

describe('test runnrer', () => {
    beforeEach(async () => {
        registerBackend(
            'webgpu',
            new Backend(),
            ops as any
        );
        await runner.init();
    });

    it('test runner init', () => {
        expect(runner.weightMap.length).toBe(7);
    });

    it('test runner api checkModelLoaded', async () => {
        runner.weightMap = [];
        await runner.preheat();
        expect(runner.weightMap.length).toBe(7);
    });

    it('test runner preheat', async () => {
        await runner.preheat();
        const noOpDataOp = runner.weightMap.filter(item => !item.opData);
        expect(noOpDataOp.length).toBe(2);
        const secondOp = runner.weightMap[1];
        expect(secondOp.opData.program[0]).toBe('mock program');
    });

    it('test runner paused', async () => {
        runner.stopPredict();
        expect(runner.isPaused).toBeTruthy();
        const res = await runner.predict({});
        expect(res).toBeUndefined();
    });
});
