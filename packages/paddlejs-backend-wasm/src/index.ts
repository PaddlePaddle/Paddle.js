/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerBackend } from '@paddlejs/paddlejs-core';
import WasmBackend from './backend';
import ops from './ops';

const wasmInstance = new WasmBackend();

function registerWasmBackend() {
    registerBackend(
        'wasm',
        wasmInstance,
        ops
    );
    return wasmInstance;
}

registerWasmBackend();

export {
    wasmInstance
};
