/**
 * @file ModelGraph，graph 生成器
 */

import { ModelOp, GraphType, Model, ModelVar, RunnerConfig } from './commons/interface';
import OpExecutor from './opFactory/opExecutor';
import transformActions from './transform';

import type Transformer from './transform/transformer';

interface GraphPlugins {
    [key: string]: Transformer[];
}

enum TransformName {
    PreTransforms = 'preTransforms',
    Transforms = 'transforms',
    PostTransforms = 'postTransforms'
}

function pluckTransformFunction(plugins: GraphPlugins, name: TransformName): Transformer[] {
    return plugins
        ? plugins[name] || []
        : [];
}

export default class ModelGraph {
    weightMap: OpExecutor[] = [];
    ops: ModelOp[] = [];
    vars: ModelVar[] = [];
    config: RunnerConfig = {} as RunnerConfig;
    type: GraphType = GraphType.SingleOutput;
    plugins: GraphPlugins = null;

    constructor(model: Model, config: RunnerConfig) {
        this.ops = model.ops;
        this.vars = model.vars;
        this.type = config.type || this.type;
        this.plugins = config.plugins;
        this.config = config;
        model.feedShape && (this.config.feedShape = model.feedShape);
    }

    /**
     * Create Ops Weight Graph
     * @returns {object} weightMap
     */
    createGraph(): OpExecutor[] {
        this.preTransforms();
        this.createOpsMap();
        this.arrangeMap();
        this.postTransforms();
        return this.weightMap;
    }

    /**
     * Tranform Ops Map before Creating Ops Map
     */
    preTransforms(): void {
        [...transformActions.preTransforms, ...pluckTransformFunction(this.plugins, TransformName.PreTransforms)]
            .forEach(action => {
                action.transform(this.ops, this.vars, this.config);
            });
    }

    /**
     * Tranform Op while Traversing the Ops Map
     */
    transforms(op: OpExecutor, opsMap: OpExecutor[]): void {
        [...transformActions.transforms, ...pluckTransformFunction(this.plugins, TransformName.Transforms)]
            .forEach(action => {
                action.transform(op, this.vars, opsMap);
            });
    }

    /**
     * Tranform Weight Map after Arranging Map
     */
    postTransforms(): void {
        [...transformActions.postTransforms, ...pluckTransformFunction(this.plugins, TransformName.PostTransforms)]
            .forEach(action => {
                action.transform(this.weightMap, this.vars, this.type);
            });
    }

    /**
     * Create Ops Executor Object Map
     */
    private createOpsMap() {
        const opsMap: OpExecutor[] = [];

        for (let index = 0; index < this.ops.length; index++) {
            const idx = opsMap.length;
            const item = this.ops[index];
            const opExecutor = new OpExecutor(item, idx);
            this.transforms(opExecutor, opsMap);
            opsMap.push(opExecutor);
        }

        this.weightMap = opsMap;
    }

    private arrangeMap() {
        const inIndex: number[] = [];
        const idtoindex: object = {};
        const indexMap: object = {};

        for (let index = 0; index < this.weightMap.length; index++) {
            const item = this.weightMap[index];
            for (let i = 0; i < item.outputsName.length; i++) {
                const outputName = item.outputsName[i];
                if (!indexMap[outputName]) {
                    indexMap[outputName] = 1;
                }
                else {
                    indexMap[outputName]++;
                }
                idtoindex[item.id] = index;
            }
        }

        for (let index = 0; index < this.weightMap.length; index++) {
            const item = this.weightMap[index];

            inIndex[index] = 0;

            for (let i = 0; i < item.inputsName.length; i++) {
                const inputName = item.inputsName[i];
                if (indexMap[inputName]) {
                    inIndex[index]++;
                }
            }
        }

        this.topoSort(this.weightMap, inIndex, idtoindex);
    }

    private topoSort(ops: OpExecutor[], inIndex: number[], idtoindex: object) {
        const zeroIndexList = [];
        const bpOp = ops.slice(0);
        for (let i = 0; i < inIndex.length; i++) {
            if (inIndex[i] === 0) {
                zeroIndexList.push(ops[i]);
            }
        }

        let preOp = null;
        for (const curOp of zeroIndexList) {
            preOp = this.topoSortInner(ops, inIndex, idtoindex, curOp, bpOp, preOp);
        }
    }

    private topoSortInner(
        ops: OpExecutor[],
        inIndex: number[],
        idtoindex: object,
        curOp: OpExecutor,
        ops_temp: OpExecutor[],
        preOp?: OpExecutor
    ) {
        const inline = [curOp];
        let prev: OpExecutor = preOp;
        let iterator: OpExecutor = curOp;

        while (inline.length > 0) {
            if (prev) {
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

        ops[idtoindex[prev.id]].next = iterator.id;
        return iterator;
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
