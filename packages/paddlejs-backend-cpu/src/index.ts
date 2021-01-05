/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import { registerBackend } from '@paddlejs/paddlejs-core';
import CpuBackend from './backend';
import { ops } from './ops';

const instance = new CpuBackend();

function registerCpuBackend() {
    registerBackend(
        'cpu',
        instance,
        ops
    );
    return instance;
}

registerCpuBackend();

export default instance;
