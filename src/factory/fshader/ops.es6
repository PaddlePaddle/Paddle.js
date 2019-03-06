/* eslint-disable */
import conf_conv2d from '../../shader/conv2d/conf';
/**
 * @file op文件
 * @author yangmingming
 */

export default {
    common: {
        params: require('../../shader/atom/common_params.c'),
        func: require('../../shader/atom/common_func.c'),
        prefix: require('../../shader/atom/prefix.c'),
        ivec56: require('../../shader/atom/type_ivec56.c'),
        sigmoid: require('../../shader/atom/sigmoid.c')
    },
    ops: {
        conv2d: {
            params: require('../../shader/conv2d/params.c'),
            func: require('../../shader/conv2d/main.c'),
            confs: conf_conv2d
        }
    },
    atoms: {
        getArrayIndexFromTensorPos: require('../../shader/atom/getArrayIndexFromTensorPos.c'),
        getArrayIndexFromTexturePos: require('../../shader/atom/getArrayIndexFromTexturePos.c'),
        getTensorPosFromArrayIndex: require('../../shader/atom/getTensorPosFromArrayIndex.c'),
        getTexturePosFromArrayIndex: require('../../shader/atom/getTexturePosFromArrayIndex.c'),
        getValueFromTensorPos: require('../../shader/atom/getValueFromTensorPos.c'),
        getValueFromTexturePos: require('../../shader/atom/getValueFromTexturePos.c'),
        moveTexture2PosToReal: require('../../shader/atom/moveTexture2PosToReal.c')
    }
};
