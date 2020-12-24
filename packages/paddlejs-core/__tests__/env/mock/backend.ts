import PaddlejsBackend from '../../../src/backend';

export default class MockBackend extends PaddlejsBackend {
    status: string = 'unready';

    constructor() {
        super();
    }

    init(): void {
        this.status = 'init';
    }

    createProgram(): string {
        return 'mock program';
    }

    runProgram(): void {
        // throw Error('not working');
        this.status = 'run op program';
    }

    read(): Float32Array | number[] {
        // throw Error('nothing to read');
        this.status = 'complete';
        return [1, 1, 1, 1];
    }

}
