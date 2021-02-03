
import { Arr, Obj, Value } from './utils/json';
function getGlobalNamespace(): any {
    let ns: any;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else if (typeof (self) !== 'undefined') {
        ns = self;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}

const _global = getGlobalNamespace();
_global.i32 =  function (num: number): number {
    return num;
}

_global.f32 =  function (num: number): number {
    return num;
}
_global.Obj = Obj;
_global.Arr = Arr;
_global.Value = Value;

export {};


