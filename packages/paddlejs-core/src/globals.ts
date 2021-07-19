import { OpInfo, Ops } from './commons/interface';
import { getOrMakeGlobalProperty } from './commons/utils';

interface OpRegistry {
    ops: Ops;
}

interface GLOBALS_INTERFACE {
    opRegistry: OpRegistry;
    backend: string;
    backendInstance: any; // todo Class Backend
}

let GLOBALS: GLOBALS_INTERFACE = {
    opRegistry: {
        ops: {}
    },
    backend: '',
    backendInstance: null
};

function registerOp(opInfo: OpInfo, key: string) {
    const {
        conf,
        params,
        main,
        main_packed = '',
        behaviors = []
    } = opInfo;

    const opKey = `${GLOBALS.backend}_${key}`;
    if (GLOBALS.opRegistry.ops[opKey]) {
        return;
    }

    GLOBALS.opRegistry.ops[opKey] = {
        name: key,
        conf,
        params,
        main,
        main_packed,
        behaviors
    };
}

function registerBackend(backend: string, backendInstance: any, ops: Ops) {
    if (backend) {
        GLOBALS.backend = backend;
    }

    if (backendInstance) {
        GLOBALS.backendInstance = backendInstance;
    }

    if (ops) {
        Object.keys(ops).forEach(key => {
            registerOp(ops[key], key);
        });
    }
}


GLOBALS = getOrMakeGlobalProperty('GLOBALS', GLOBALS);

export {
    GLOBALS,
    registerBackend
};
