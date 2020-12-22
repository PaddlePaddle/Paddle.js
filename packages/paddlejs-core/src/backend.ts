/**
 * @file backend 抽象类
 */

// @ts-nocheck
import { OpData, ModelVar as FetchInfo } from './commons/interface';

export default abstract class PaddlejsBackend {
    public abstract init(): void;

    abstract createProgram(opts: object): string;

    abstract runProgram(opData: OpData, isRendered: boolean): void;

    abstract read(fetchInfo: FetchInfo): Float32Array | number[];
}
