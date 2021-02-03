/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import "./global.ts";
import { registerBackend, env } from '@paddlejs/paddlejs-core';
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

env.set('platform', 'browser');

export default instance;
