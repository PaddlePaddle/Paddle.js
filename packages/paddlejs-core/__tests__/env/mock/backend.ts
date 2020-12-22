import PaddlejsBackend from '../../../src/backend';

export default class MockBackend extends PaddlejsBackend {
    device: object | null = null;

    constructor() {
        super();
    }

    init() {
        this.device = null;
    }

    createProgram(): string {
        return 'mock program';
    }

    runProgram(): void {

    }

    read(): Float32Array | number[] {
        return [1, 1, 1];
    }

}
