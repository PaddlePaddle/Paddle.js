import { OpInfo } from './commons/interface';


interface Ops {
    // key => backend_name
    [key: string]: OpInfo;
}

interface OpRegistry {
    ops: Ops;
}

interface GLOBALS_INTERFACE {
    opRegistry: OpRegistry;
    backend: string;
    backendVersion: number;
    backendInstance: any; // todo Class Backend
}

export const GLOBALS: GLOBALS_INTERFACE = {
    opRegistry: {
        ops: {}
    },
    backend: '',
    backendVersion: 2,
    backendInstance: null
};


function registerOp(opInfo: OpInfo, key: string) {
    const {
        conf,
        params,
        main,
        inputsName,
        outputsName,
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
        inputsName,
        outputsName,
        params,
        main,
        main_packed,
        behaviors
    };
}

export function registerBackend(backend: string, backendInstance: any, ops: Ops) {
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
