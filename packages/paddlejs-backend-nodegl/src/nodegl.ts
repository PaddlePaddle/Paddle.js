import { GLHelper } from '../../paddlejs-backend-webgl/src/webgl/WebGLUtils';
import { WebGLContextAttributes } from '../../paddlejs-backend-webgl/src/webgl/webgl_types';
import { env } from '../../paddlejs-core/src/index';

const nodeglConstructor = require('gl');

const WEBGL_CONF: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true
};

const WEBGL_WIDTH = 64;
const WEBGL_HEIGHT = 64;
const gl: WebGLRenderingContext = nodeglConstructor(WEBGL_WIDTH, WEBGL_HEIGHT, WEBGL_CONF);

// set gl context
GLHelper.setWebGLRenderingContext(gl);

// set gl version
GLHelper.setWebglVersion(1);

env.set('platform', 'node');
