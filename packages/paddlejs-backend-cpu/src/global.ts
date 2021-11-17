
import { getGlobalInterface } from '@paddlejs/paddlejs-core/globals';
import { Arr, Obj, Value } from './utils/json';

const _global = getGlobalInterface();
_global.i32 = function (num: number): number {
    return num;
};

_global.f32 = function (num: number): number {
    return num;
};
_global.isString = function (val): boolean {
    return typeof val === 'string';
};

_global.bool = function (val): boolean {
    return Boolean(val);
};

_global.isDefined = function (val): boolean {
    return typeof val !== 'undefined';
};

_global.Obj = Obj;
_global.Arr = Arr;
_global.Value = Value;

export {};

