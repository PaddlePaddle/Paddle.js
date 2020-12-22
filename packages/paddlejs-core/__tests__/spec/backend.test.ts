import { PaddlejsBackend } from '../../src';
import mockData from '../env/mock/opData';

describe('test backend', () => {
    const backend = new PaddlejsBackend();

    it('test api init', () => {
        expect(() => {
            backend.init();
        }).toThrow();
    });

    it('test api createProgram', () => {
        expect(() => {
            backend.createProgram({});
        }).toThrow();
    });

    it('test api runProgram', () => {
        expect(() => {
            backend.runProgram(mockData.opData, false);
        }).toThrow();
    });

    it('test api runProgram', () => {
        expect(() => {
            backend.read(mockData.opVar);
        }).toThrow();
    });

});
