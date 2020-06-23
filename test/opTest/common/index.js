const WEBGL_CONF = {
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

const gl = require('gl')(WEBGL_WIDTH, WEBGL_HEIGHT, WEBGL_CONF);

export const webgl = gl;
