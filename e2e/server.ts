const path = require('path');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webglWebpackConfig = require('../packages/paddlejs-backend-webgl/webpack.prod');
const coreWebpackConfig = require('../packages/paddlejs-core/webpack.prod');
const mobilenetWebpackConfig = require('../packages/paddlejs-models/mobilenet/webpack.prod');
const gestureWebpackConfig = require('../packages/paddlejs-models/gesture/webpack.prod');
const humansegWebpackConfig = require('../packages/paddlejs-models/humanseg/webpack.prod');
const ocrWebpackConfig = require('../packages/paddlejs-models/ocr/webpack.prod');

const DIST_DIR = path.join(__dirname, 'dist');

delete humansegWebpackConfig.entry.index_gpu;

class ConfigInfo {
    key: string;
    config: any;
    isModelSdk: boolean;
    compiler: any;

    constructor(key, config, isModelSdk = false) {
        this.key = key;
        this.config = config;
        this.isModelSdk = isModelSdk;
        this.compiler = null;
    }
}

const core = new ConfigInfo('core', coreWebpackConfig);
const webgl = new ConfigInfo('webgl', webglWebpackConfig);
const mobilenet = new ConfigInfo('mobilenet', mobilenetWebpackConfig, true);
const gesture = new ConfigInfo('gesture', gestureWebpackConfig, true);
const humanseg = new ConfigInfo('humanseg', humansegWebpackConfig, true);
const ocr = new ConfigInfo('ocr', ocrWebpackConfig, true);

// edit webpack config
[core, webgl, mobilenet, gesture, humanseg, ocr].forEach(instance => {
    const config = instance.config;
    config.output.path = DIST_DIR;
    config.output.filename = `${instance.key}_bundle.js`;

    if (instance.isModelSdk) {
        config.resolve = Object.assign({}, config.resolve, {
            alias: {
                '@paddlejs/paddlejs-core': path.resolve(DIST_DIR, './core_bundle.js'),
                '@paddlejs/paddlejs-backend-webgl': path.resolve(DIST_DIR, './webgl_bundle.js')
            }
        });
    }

    instance.compiler = webpack(config);
});

const port = 9898;
const app = express()
    .use(middleware(core.compiler, {
        writeToDisk: true
    }))
    .use(middleware(webgl.compiler, {
        writeToDisk: true
    }))
    .use(middleware(mobilenet.compiler))
    .use(middleware(gesture.compiler))
    .use(middleware(humanseg.compiler))
    .use(middleware(ocr.compiler))
    .use(express.static(DIST_DIR));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});
