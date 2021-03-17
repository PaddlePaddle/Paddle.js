/**
 * @file webgl backend entry
 * @author yueshuangyan
 */

import './global.ts';
import { registerBackend, env } from '@paddlejs/paddlejs-core';
import CpuBackend from './backend';
import * as opMap from './ops';
import { Ops, OpInfo } from './types';

// op信息增强  behavior, 此环节可能更改opName(遗留)
const commonFuncBehaviors = {
    relu: ['transToPrelu'],
    relu6: ['transToRelu6'],
    leaky_relu: ['transToLeakyrelu'],
    transToLeakyrelu: ['transToLeakyrelu'],
    scale: ['transToScale'],
    sigmoid: ['transToSigmoid'],
    hard_sigmoid: ['transToHardSigmoid'],
    pow: ['transToPow']
};

const ops = {} as Ops;
Object.keys(opMap).forEach(val => {
    ops[val] = { ...opMap[val] } as OpInfo;
});
const dyNamicList = ['relu', 'prelu', 'relu6', 'leakyRelu', 'scale', 'sigmoid', 'hardSigmoid', 'sqrt', 'pow'];

// enhance index of dynamic operators
for (const dyNamicName of dyNamicList) {
    ops[dyNamicName] = { ...opMap.dynamic } as unknown;
}

// enhance behaviors of dynamic operators
Object.keys(commonFuncBehaviors).forEach(opKey => {
    ops[opKey] = { ...(ops[opKey] || {}), behaviors: commonFuncBehaviors[opKey] };
});

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
