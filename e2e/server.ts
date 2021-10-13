const path = require('path');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webglWebpackConfig = require('../packages/paddlejs-backend-webgl/webpack.prod');
const coreWebpackConfig = require('../packages/paddlejs-core/webpack.prod');
const mobilenetWebpackConfig = require('../packages/paddlejs-models/mobilenet/webpack.prod');

const DIST_DIR = path.join(__dirname, 'dist');

class ConfigInfo {
    key: string;
    config: any;
    isModelSdk: boolean;

    constructor(key, config, isModelSdk = false) {
        this.key = key;
        this.config = config;
        this.isModelSdk = isModelSdk;
    }
}

const core = new ConfigInfo('core', coreWebpackConfig);
const webgl = new ConfigInfo('webgl', webglWebpackConfig);
const mobilenet = new ConfigInfo('mobilenet', mobilenetWebpackConfig, true);

[core, webgl, mobilenet].forEach(instance => {
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
});


const webglCompiler = webpack(webgl.config);
const coreCompiler = webpack(core.config);
const mobilenetCompiler = webpack(mobilenet.config);

const port = 9898;
const app = express()
    .use(middleware(coreCompiler, {
        publicPath: core.config.output.publicPath,
        writeToDisk: true
    }))
    .use(middleware(webglCompiler, {
        publicPath: webgl.config.output.publicPath,
        writeToDisk: true
    }))
    .use(middleware(mobilenetCompiler, {
        publicPath: mobilenet.config.output.publicPath || '/',
        writeToDisk: true
    }))
    .use(express.static(DIST_DIR));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});