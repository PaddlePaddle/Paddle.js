/* eslint-disable */
import conf_conv2d from '../../shader/conv2d/conf';
import conf_dynamic from '../../shader/dynamic/conf';
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
        }
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
