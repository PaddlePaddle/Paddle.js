/* eslint-disable */
import conf_conv2d from '../../shader/conv2d/conf';
import conf_dynamic from '../../shader/dynamic/conf';
import conf_pool2d from '../../shader/pool2d/conf';
import conf_elementwise_add from '../../shader/elementwise_add/conf';

/**
 * @file op文件
 * @author yangmingming
 */

export default {
    common: {
        params: require('../../shader/atom/common_params.c'),
        func: require('../../shader/atom/common_func.c'),
        prefix: require('../../shader/atom/prefix.c'),
        ivec56: require('../../shader/atom/type_ivec56.c')
    },
    ops: {
        conv2d: {
            params: require('../../shader/conv2d/params.c'),
            func: require('../../shader/conv2d/main.c'),
            confs: conf_conv2d
        },
        dynamic: {
            params: require('../../shader/dynamic/params.c'),
            func: require('../../shader/dynamic/main.c'),
            confs: conf_dynamic
        },
        pool2d: {
            params: require('../../shader/pool2d/params.c'),
            func: require('../../shader/pool2d/main.c'),
            confs: conf_pool2d
        },
        elementwise_add: {
            params: require('../../shader/elementwise_add/params.c'),
            func: require('../../shader/elementwise_add/main.c'),
            confs: conf_elementwise_add
        },
    },
    atoms: {
        getArrayIndexFromTensorPos: require('../../shader/atom/getArrayIndexFromTensorPos.c'),
        getArrayIndexFromTexturePos: require('../../shader/atom/getArrayIndexFromTexturePos.c'),
        getTensorPosFromArrayIndex: require('../../shader/atom/getTensorPosFromArrayIndex.c'),
        getTexturePosFromArrayIndex: require('../../shader/atom/getTexturePosFromArrayIndex.c'),
        getValueFromTensorPos: require('../../shader/atom/getValueFromTensorPos.c'),
        getValueFromTexturePos: require('../../shader/atom/getValueFromTexturePos.c'),
        moveTexture2PosToReal: require('../../shader/atom/moveTexture2PosToReal.c'),
        getPixelsFromTexturePos: require('../../shader/atom/getPixelsFromTexturePos.c'),
        sigmoid: require('../../shader/atom/sigmoid.c'),
        prelu: require('../../shader/atom/prelu.c'),
        scale: require('../../shader/atom/scale.c'),
        softmax: require('../../shader/atom/softmax.c')
    }
};
