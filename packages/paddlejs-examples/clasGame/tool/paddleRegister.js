import * as paddlejs from '@paddlejs/paddlejs-core'; // 引入 paddlejs-core
import { CONFIG } from '../config.js';
import '@paddlejs/paddlejs-backend-webgl'; // 引入 backend-webgl
// eslint-disable-next-line no-undef
const plugin = requirePlugin('paddlejs-plugin'); // 引入小程序插件
// eslint-disable-next-line no-undef
plugin.register(paddlejs, wx); // 注入微信全局环境变量

export const PaddleJS = new paddlejs.Runner({
    modelPath: CONFIG.config.modelInfo.path || 'https://mms-voice-fe.cdn.bcebos.com/pdmodel/clas/fuse/v4_03082014',
    mean: CONFIG.config.modelInfo.mean || [0.485, 0.456, 0.406],
    std: CONFIG.config.modelInfo.std || [0.229, 0.224, 0.225],
    webglFeedProcess: true
});
