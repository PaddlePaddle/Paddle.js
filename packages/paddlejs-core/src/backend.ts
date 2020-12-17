/**
 * @file backend，backend 抽象类
 */

// @ts-nocheck
import { OpData, ModelVar as fetchInfo } from './commons/interface';

export default class PaddlejsBackend {
    createProgram(opts: object): string {
        return notYetImplemented('createProgram');
    }

    runProgram(type: string, opData: OpData, isRendered: boolean): void {
        notYetImplemented('runProgram');
    }

    read(fetchInfo: fetchInfo): Float32Array | number[] {
        return notYetImplemented('read');
    }
}


function notYetImplemented(name: string): never {
    throw new Error(
        `Method '${name}' not yet implemented or not found in the registry. `
        + 'This method should be supported by the backend you have chosen');
}
