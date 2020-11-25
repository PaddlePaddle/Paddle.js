import { OpInfo } from './commons/interface';

interface OpRegistry {
    ops: {
        // key => backend_name
        [key: string]: OpInfo;
    };
    opsBehavior?: {
        // key => backend_hehavior
        [key: string]: Function;
    };
}

interface GLOBALS_INTERFACE {
    opRegistry: OpRegistry;
    backend: string;
    backend_version: number;
    backend_instance: any; // todo Class Backend
}

export const GLOBALS: GLOBALS_INTERFACE = {
    opRegistry: {
        ops: {}
    },
    backend: 'webgl',
    backend_version: 2,
    backend_instance: null
};


export function registerOpsBehaviors(opsBehavior) {
    GLOBALS.opRegistry.opsBehavior = opsBehavior;
}

export function registerOp(opInfo: OpInfo) {
    const {
        name,
        conf,
        params,
        main,
        inputsName,
        outputsName,
        main_packed = '',
        behaviors = []
    } = opInfo;

    const opKey = `${GLOBALS.backend}_${name}`;
    if (GLOBALS.opRegistry.ops[opKey]) {
        return;
    }

    GLOBALS.opRegistry.ops[opKey] = {
        name,
        conf,
        inputsName,
        outputsName,
        params,
        main,
        main_packed,
        behaviors
    };
}

export function registerBackend(backend: string, backendInstance: any, version?: number) {
    if (backend) {
        GLOBALS.backend = backend;
    }
    if (version) {
        GLOBALS.backend_version = version;
    }
    if (backendInstance) {
        GLOBALS.backend_instance = backendInstance;
    }
}
