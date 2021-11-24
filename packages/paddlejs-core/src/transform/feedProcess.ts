/**
 * @file image pre process
 */

import { ModelOp, UniformType } from '../commons/interface';
import { findVarByKey, AddItemToVars } from '../commons/utils';
import env from '../env';
import Transformer from './transformer';

const IMG_PRE_PROCESS_VAR = 'img_pre_processed';
const IMG_ORIGIN = 'img_origin';
export default class WebglFeedProcess extends Transformer {
    constructor() {
        super('FeedProcess');
    }

    transform(...args: any) {
        if (!env.get('webgl_feed_process') && !env.get('webgl_gpu_pipeline')) {
            return;
        }
        const [ops, vars, modelConfig] = args;
        const {
            mean = [0, 0, 0],
            std = [1, 1, 1],
            scale = [1, 1],
            pos = [0, 0],
            feedShape
        } = modelConfig;

        // make img_pre_processed var
        const imgVar = findVarByKey(vars, 'image');
        const [, , h, w] = imgVar.shape;
        imgVar.shape = [1, 1, h, w];
        const processImgVar = Object.assign({}, imgVar);
        processImgVar.name = IMG_PRE_PROCESS_VAR;
        processImgVar.shape = [1, 3, feedShape.fh, feedShape.fw];
        processImgVar.persistable = false;
        delete processImgVar.data;

        const originImgVar = Object.assign({}, imgVar);
        originImgVar.name = IMG_ORIGIN;
        originImgVar.shape = [1, 1, feedShape.fh, feedShape.fw];
        originImgVar.persistable = false;
        delete originImgVar.data;

        AddItemToVars(vars, [originImgVar, processImgVar]);

        // change recieve_img op input
        const imageOriginInputOp = ops.find(item => {
            const inputsMap = item.inputs;
            return Object.keys(inputsMap).find(key => inputsMap[key][0] === 'image');
        });
        const inputs = imageOriginInputOp.inputs;
        Object.keys(inputs).forEach(key => {
            if (inputs[key][0] === 'image') {
                inputs[key][0] = IMG_PRE_PROCESS_VAR;
            }
        });

        // make feed post process op
        const imgPreProcessOp: ModelOp = {
            attrs: {
                mean,
                std
            },
            inputs: {
                X: [IMG_ORIGIN]
            },
            outputs: {
                Y: [IMG_PRE_PROCESS_VAR]
            },
            type: 'feedPost'
        };

        // make feed post process op
        const imgOriginOp: ModelOp = {
            attrs: {
                mean,
                std,
                scale,
                pos
            },
            inputs: {
                X: ['image']
            },
            outputs: {
                Y: [IMG_ORIGIN]
            },
            type: 'imgFeed',
            uniform: {
                u_scale: {
                    type: UniformType.uniform2fv,
                    value: [1, 1]
                },
                u_pos: {
                    type: UniformType.uniform2fv,
                    value: [0, 0]
                }
            },
            isPacked: true
        };
        ops.splice(1, 0, imgPreProcessOp);
        ops.splice(1, 0, imgOriginOp);
    }
}

