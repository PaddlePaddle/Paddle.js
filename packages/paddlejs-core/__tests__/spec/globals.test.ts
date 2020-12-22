import { ops } from '../../../paddlejs-backend-webgpu/src/ops';
import { GLOBALS, registerOp, registerBackend } from '../../src/globals';
import Backend from '../env/mock/backend';

describe('test globals', () => {
    registerBackend(
        'webgpu',
        new Backend()
    );
    Object.keys(ops).forEach(key => {
        registerOp(ops[key], key);
    });

    it('test op register', () => {
        expect(Object.keys(GLOBALS.opRegistry.ops).length).toBeGreaterThan(1);
    });

    it('test backend register', () => {
        expect(GLOBALS.backend).toBe('webgpu');
    });

});
