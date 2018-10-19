/**
 * @file 工具类
 * @author yangmingming
 */
export default {
    async loadShader(name) {
        let shader = await fetch(name);
        return shader.text();
    }
};