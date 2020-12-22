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
        expect(() => {
            backend.runProgram();
        }).toThrow();
    });

    it('test api runProgram', () => {
        expect(() => {
            backend.read();
        }).toThrow();
    });

});
