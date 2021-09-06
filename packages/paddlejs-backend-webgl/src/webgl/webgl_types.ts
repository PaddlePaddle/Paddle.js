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
  powerPreference?: string;
}

export enum UniformType {
    uniform1f = '1f',
    uniform1fv = '1fv',
    uniform1i = '1i',
    uniform1iv = '1iv',
    uniform2f = '2f',
    uniform2fv = '2fv',
    uniform2i = '2i',
    uniform2iv = '2iv',
    uniform3f = '3f',
    uniform3fv = '3fv',
    uniform3i = '3i',
    uniform3iv = '3iv',
    uniform4f = '4f',
    uniform4fv = '4fv',
    uniform4i = '4i',
    uniform4iv = '4iv'
}