import { ops } from '../../../paddlejs-backend-webgpu/src/ops';
import { GLOBALS, registerOp, registerBackend } from '../../src/globals';
import PaddlejsBackend from '../../src/backend';

describe('test globals', () => {
    registerBackend(
        'webgpu',
        new PaddlejsBackend()
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
