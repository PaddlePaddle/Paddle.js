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


export function registerOpsBehaviors(opsBehavior) {
    GLOBALS.opRegistry.opsBehavior = opsBehavior;
}

export function registerOp(opInfo: OpInfo, key: string) {
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

export function registerBackend(backend: string, backendInstance: any, version?: number) {
    if (backend) {
        GLOBALS.backend = backend;
    }
    if (version) {
        GLOBALS.backendVersion = version;
    }
    if (backendInstance) {
        GLOBALS.backendInstance = backendInstance;
    }
}
