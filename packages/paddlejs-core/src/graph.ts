import { Model, ModelVar, ModelOp } from './commons/interface';
import dataProcess from './dataProcess';
import OpExecutor from './opFactory/opExecutor';
import packedOpConditions from './opFactory/packedOpConditions';
import { createUnpacked2packedOp, createPacked2unpackedOp, transformOriginOp } from './opFactory/utils';

export default class ModelGraph {
    weightMap: OpExecutor[] = [];
    formatLayout: string = 'NCHW';
    ops: ModelOp[] = [] as ModelOp[];
    vars: ModelVar[] = [] as ModelVar[];

    constructor(model: Model) {
        const {
            ops,
            vars
        } = model;
        this.ops = ops;
        this.vars = vars;
    }

    /**
     * Create Ops Weight Graph
     * @returns {object} weightMap
     */
    createGraph(): OpExecutor[] {
        this.formatWeight();
        this.createOpsMap();
        this.constructOpsMap();
        this.arrangeMap();
        return this.weightMap;
    }


    private formatWeight() {
        if (this.formatLayout === 'NHWC') {
            this.vars.forEach((item: ModelVar) => {
                if (item.data && item.shape) {
                    item.data = dataProcess.nhwc2nchw(item.data, item.shape);
                }
            });
        }
    }

    /**
     * Create Ops Executor Object Map
     */
    private createOpsMap() {
        const opsMap: OpExecutor[] = [];
        this.ops.forEach(item => {
            let idx = opsMap.length;
            const opExecutor = new OpExecutor(item, idx);
            // add unpacked2packedOP and packed2unpackedOp
            // current: only support one input case
            // todo: support multi inputs

            // op which unsupports packed
            if (!packedOpConditions[opExecutor.type]
                || !packedOpConditions[opExecutor.type](item, this.vars)
            ) {

                opsMap.push(opExecutor);
                return;
            }
            const {
                inputsName,
                outputsName
            } = opExecutor;
            // deal with unpacked2packed op
            const unpacked2packedOp = createUnpacked2packedOp({
                inputName: inputsName[0],
                outputName: `${inputsName[0]}_packed`
            });
            idx = opsMap.length;
            opsMap.push(new OpExecutor(unpacked2packedOp, idx));

            // deal with origin packed op
            const transformedOp = transformOriginOp(item);
            idx = opsMap.length;
            opsMap.push(new OpExecutor(transformedOp, idx, true));

            // deal with packed2unpacked op
            const packed2unpackedOp = createPacked2unpackedOp({
                inputName: `${outputsName[0]}_packed`,
                outputName: outputsName[0]
            });
            idx = opsMap.length;
            opsMap.push(new OpExecutor(packed2unpackedOp, idx));

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
    getFeedExecutor() : OpExecutor | undefined {
        return this.weightMap.find((item: OpExecutor) => item.type === 'feed');
    }

    /**
     * Get weightMap end Node FETCH
     * @returns {OpExecutor}
     */
    getFetchExecutor() : OpExecutor | undefined {
        return this.weightMap.find((item: OpExecutor) => item.type === 'fetch');
    }

    /**
     * get op executor by id in weightMap
     * @param id
     * @returns {OpExecutor}
     */
    getExecutorById(id: string): OpExecutor | undefined {
        return this.weightMap.find((op: OpExecutor) => op.id === id);
    }
}
