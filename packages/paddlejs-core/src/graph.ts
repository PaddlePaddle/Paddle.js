/**
 * @file ModelGraph，graph 生成器
 */

import { ModelOp, GraphType, Model, ModelVar, ModelConfig } from './commons/interface';
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
    config: ModelConfig = {} as ModelConfig;
    type: GraphType = GraphType.SingleOutput;
    plugins: GraphPlugins = null;

    constructor(model: Model, config: ModelConfig) {
        this.ops = model.ops;
        this.vars = model.vars;
        this.type = config.type || this.type;
        this.plugins = config.plugins;
        this.config = config;
    }

    /**
     * Create Ops Weight Graph
     * @returns {object} weightMap
     */
    createGraph(): OpExecutor[] {
        this.preTransforms();
        this.createOpsMap();
        this.constructOpsMap();
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

    /**
     * Construct Ops Relationship
     */
    private constructOpsMap() {
        for (let index = 0; index < this.weightMap.length; index++) {
            const item = this.weightMap[index];
            const outputsName = item.outputsName[0];
            const next = this.getNextExecutor(this.weightMap, outputsName);
            if (next) {
                item.next = next.id;
            }
        }
    }

    private arrangeMap() {
        const executed: object = {};
        const inIndex: number[] = [];
        const idtoindex: object = {};

        for (let index = 0; index < this.weightMap.length; index++) {
            const item = this.weightMap[index];
            for (let index = 0; index < item.outputsName.length; index++) {
                const output = item.outputsName[index];
                executed[output] = true;
            }
        }

        for (let index = 0; index < this.weightMap.length; index++) {
            const item = this.weightMap[index];
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
        }

        this.topoSort(this.weightMap, inIndex, idtoindex);
    }

    private topoSort(ops: OpExecutor[], inIndex: number[], idtoindex: object) {
        const inline: OpExecutor[] = [];
        inline.push(ops[0]);
        const ops_temp = ops.slice(0);
        let prev: OpExecutor = null;
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
