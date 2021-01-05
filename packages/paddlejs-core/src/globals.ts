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

function getOrMakeGlobals(): GLOBALS_INTERFACE {
    const globalNameSpace = getGlobalNamespace();
    if (globalNameSpace.GLOBALS) {
        return globalNameSpace.GLOBALS;
    }
    globalNameSpace.GLOBALS = GLOBALS;
    return globalNameSpace.GLOBALS;
}

GLOBALS = getOrMakeGlobals();

export {
    GLOBALS,
    registerBackend
};
