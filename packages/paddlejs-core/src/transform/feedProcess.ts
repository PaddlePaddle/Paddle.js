/**
 * @file image pre process
 */

import { ModelOp } from '../commons/interface';
import env from '../env';
import Transformer from './transformer';

const IMG_PRE_PROCESS_VAR = 'img_pre_processed';
export default class WebglFeedProcess extends Transformer {
    constructor() {
        super('FeedProcess');
    }

    transform(...args: any) {
        if (!env.get('webgl_feed_process')) {
            return;
        }
        const [ops, vars, modelConfig] = args;
        const {
            mean = [0, 0, 0],
            std = [1, 1, 1],
            feedShape
        } = modelConfig;

        // make img_pre_processed var
        const imgVar = vars.find(item => item.name === 'image');
        imgVar.shape = [1, 4, feedShape.fh, feedShape.fw];
        const processImgVar = Object.assign({}, imgVar);
        processImgVar.name = IMG_PRE_PROCESS_VAR;
        processImgVar.shape = [1, 3, feedShape.fh, feedShape.fw];
        processImgVar.persistable = false;
        delete processImgVar.data;
        vars.push(processImgVar);

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
                X: ['image']
            },
            outputs: {
                Y: [IMG_PRE_PROCESS_VAR]
            },
            type: 'feedPost'
        };
        ops.splice(1, 0, imgPreProcessOp);
    }
}

