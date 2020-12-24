import Backend from '../env/mock/backend';

describe('test backend', () => {
    const backend = new Backend();

    it('test api init', () => {
        backend.init();
        expect(backend.status).toBe('init');
    });

    it('test api createProgram', () => {
        expect(backend.createProgram()).toBe('mock program');
    });

    it('test api runProgram', () => {
        backend.runProgram();
        expect(backend.status).toBe('run op program');
    });

    it('test api runProgram', () => {
        const res = backend.read();
        expect(backend.status).toBe('complete');
        expect(res).toEqual([1, 1, 1, 1]);
    });

});
