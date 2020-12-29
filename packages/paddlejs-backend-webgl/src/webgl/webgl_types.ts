/**
 * @file webgl types interface
 * @author yueshuangyan
 */

export interface WebGLContextAttributes {
  alpha?: boolean;
  antialias?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  depth?: boolean;
  stencil?: boolean;
  failIfMajorPerformanceCaveat?: boolean;
}
