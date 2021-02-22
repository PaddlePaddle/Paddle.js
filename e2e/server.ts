const path = require('path');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webglWebpackConfig = require('../packages/paddlejs-backend-webgl/webpack.prod');
const coreWebpackConfig = require('../packages/paddlejs-core/webpack.prod');

const DIST_DIR = path.join(__dirname, 'dist');

coreWebpackConfig.output.path = DIST_DIR;
coreWebpackConfig.output.filename = 'core_bundle.js';
webglWebpackConfig.output.path = DIST_DIR;
webglWebpackConfig.output.filename = 'webgl_bundle.js';

const webglCompiler = webpack(webglWebpackConfig);
const coreCompiler = webpack(coreWebpackConfig);

const port = 9898;
const app = express()
    .use(middleware(coreCompiler, {
        publicPath: coreWebpackConfig.output.publicPath
    }))
    .use(middleware(webglCompiler, {
        publicPath: webglWebpackConfig.output.publicPath
    }))
    .use(express.static(DIST_DIR));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});