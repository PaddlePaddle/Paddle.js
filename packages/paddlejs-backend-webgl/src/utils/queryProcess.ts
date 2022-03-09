/**
 * @file query工具类
 * @author yueshuangyan
 */

import { env } from '@paddlejs/paddlejs-core';

export default {
    getQueryTime(gl, query) {
        const timeElapsedNanos = gl.getQueryParameter(query, gl.QUERY_RESULT);
        // Return milliseconds.
        return timeElapsedNanos;
    },
    beginQuery(gl, glVersion) {
        if (glVersion === 2 && env.get('performance')) {
            const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
            if (!ext) {
                return;
            }
            const query = gl.createQuery();
            gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
            return query;
        }
        return null;
    },
    endQuery(gl, glVersion, query) {
        if (glVersion === 2 && env.get('performance')) {
            const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
            if (!ext) {
                return;
            }
            gl.endQuery(ext.TIME_ELAPSED_EXT);
        }
        return query;
    }
};
