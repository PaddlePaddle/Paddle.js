/**
 * @file ModelGraph，graph 生成器
 */

import { ModelOp } from './commons/interface';
import OpExecutor from './opFactory/opExecutor';

export default class ModelGraph {
    weightMap: OpExecutor[] = [];
    ops: ModelOp[] = [] as ModelOp[];

    constructor(ops: ModelOp[]) {
        this.ops = ops;
    }

    /**
     * Create Ops Weight Graph
     * @returns {object} weightMap
     */
    createGraph(): OpExecutor[] {
        this.createOpsMap();
        this.constructOpsMap();
        this.arrangeMap();
        return this.weightMap;
    }

    /**
     * Create Ops Executor Object Map
     */
    private createOpsMap() {
        const opsMap: OpExecutor[] = [];
        this.ops.forEach(item => {
            const idx = opsMap.length;
            const opExecutor = new OpExecutor(item, idx);
            opsMap.push(opExecutor);

        });

        this.weightMap = opsMap;
    }

    /**
     * Construct Ops Relationship
     */
    private constructOpsMap() {
        this.weightMap.forEach(item => {
            const outputsName = item.outputsName[0];
            const next = this.getNextExecutor(this.weightMap, outputsName);
            if (next) {
                item.next = next.id;
            }
        });
    }

    private arrangeMap() {
        const executed: any = {};
        const inIndex: number[] = [];
        const idtoindex: any = {};
        this.weightMap.forEach(item => {
            item.outputsName.forEach(i => {
                executed[i] = true;
            });
        });

        this.weightMap.forEach((item, index) => {
            inIndex[index] = 0;
            idtoindex[item.id] = index;
            if (item.inputsName.length > 1) {
                item.inputsName.forEach(i => {
                    if (executed[i] === true) {
                        inIndex[index]++;
                    }
                });
            }
            else {
                inIndex[index] = item.inputsName.length;
            }
        });
        this.topoSort(this.weightMap, inIndex, idtoindex);
    }

    private topoSort(ops: OpExecutor[], inIndex: number[], idtoindex: any) {
        const inline: any = [];
        inline.push(ops[0]);
        const ops_temp = ops.slice(0);
        let prev: any = null;
        let iterator: OpExecutor = ops[0];
        while (inline.length > 0) {
            if (prev != null) {
                ops[idtoindex[prev.id]].next = iterator.id;
            }
            prev = iterator;
            iterator = inline.pop() || {} as OpExecutor;
            for (let i = 0; i < iterator.outputsName.length; i++) {
                for (let k = 0; k < ops_temp.length; k++) {
                    for (let j = 0; j < ops_temp[k].inputsName.length; j++) {
                        if (ops_temp[k].inputsName[j] === iterator.outputsName[i]) {
                            inIndex[idtoindex[ops_temp[k].id]]--;
                            if (inIndex[idtoindex[ops_temp[k].id]] === 0) {
                                inline.push(ops[idtoindex[ops_temp[k].id]]);
                                ops_temp.splice(k, 1);
                                k--;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Get The Next Executor need Exec
     * @param ops
     * @param id
     * @returns {*}
     */
    private getNextExecutor(ops: OpExecutor[], id: string) {
        return ops.find(item => {
            if (!item.next) {
                for (let i = 0; i < item.inputsName.length; i++) {
                    if (id === item.inputsName[i]) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    /**
     * Get weightMap start Node FEED
     * @returns {OpExecutor}
     */
    getFeedExecutor() : OpExecutor {
        return this.weightMap.find((item: OpExecutor) => item.type === 'feed') as OpExecutor;
    }

    /**
     * Get weightMap end Node FETCH
     * @returns {OpExecutor}
     */
    getFetchExecutor() : OpExecutor {
        return this.weightMap.find((item: OpExecutor) => item.type === 'fetch') as OpExecutor;
    }

    /**
     * get op executor by id in weightMap
     * @param id
     * @returns {OpExecutor}
     */
    getExecutorById(id: string): OpExecutor {
        return this.weightMap.find((op: OpExecutor) => op.id === id) as OpExecutor;
    }
}
