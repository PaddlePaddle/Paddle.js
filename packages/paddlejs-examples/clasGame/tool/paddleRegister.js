import * as paddlejs from '@paddlejs/paddlejs-core'; // 引入 paddlejs-core
import {CONFIG} from '../config.js';
import '@paddlejs/paddlejs-backend-webgl'; // 引入 backend-webgl
const plugin = requirePlugin("paddlejs-plugin"); // 引入小程序插件
plugin.register(paddlejs, wx); // 注入微信全局环境变量

export const PaddleJS = new paddlejs.Runner({
    modelPath: CONFIG.config.modelInfo.path || 'https://mms-voice-fe.cdn.bcebos.com/pdmodel/clas/common/v4_2_0915',
    feedShape: {
        fw: 224,
        fh: 224
    },
    fill: '#fff',
    targetSize: {
        height: 224,
        width: 224
    },
    mean: CONFIG.config.modelInfo.mean || [0.485, 0.456, 0.406],
    std: CONFIG.config.modelInfo.std || [0.229, 0.224, 0.225],
    needPreheat: true
});
