/**
 * @file gpu运算
 * @author yangmingming
 */
export default class gpu {
    constructor(opts = {}) {
        this.opts = opts;
        let canvas = opts.el ? opts.el : document.createElement('canvas');
        let size = this.dim = opts.dim ? opts.dim : 256;
        size = opts.out_length || size;
        canvas.width = size;
        canvas.height = size;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl.viewport(0, 0, opts.out_length, opts.out_length);
        // Attempt to activate the extension, returns null if unavailable
        this.textureFloat  = this.gl.getExtension('OES_texture_float');
        console.log('float extension is started or not? ' + !!this.textureFloat);
        console.log('WebGl版本是 ' + this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION));
    }

    isFloatingTexture() {
        return (this.textureFloat !== null);
    }

    create(vshaderCode, fshaderCode) {
        let gl = this.gl;
        // 创建 & 绑定程序对象
        let program = this.program = gl.createProgram();

        // 创建&绑定vertex&frament shader
        this.initShader(vshaderCode);
        this.fragmentShader = this.initShader(fshaderCode, 'fragment');

        gl.linkProgram(program);
        gl.useProgram(program);

        // 传输点数据
        // let vertices = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]);
        let vertices = new Float32Array([
            -1.0,  1.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0,
            1.0,  1.0, 1.0, 1.0,
            1.0, -1.0, 1.0, 0.0]);
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        let aPosition = gl.getAttribLocation(program, 'position');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(aPosition);

        /*gl.clearColor(.0, .0, .0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);*/
    }

    /**
     * 初始化shader
     * @param code shader代码
     * @param type shader类型
     * @return {object} 初始化成功返回shader
     */
    initShader(code, type = 'vertex') {
        const shaderType = type === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER;
        let shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error("compile: " + this.gl.getShaderInfoLog(shader));
        }
        this.gl.attachShader(this.program, shader);
        return shader;
    }

    /**
     * 更新fragment shader
     * @param code shader代码
     * @return {boolean} 更新成功过返回true
     */
    updateShader(code) {
        this.gl.useProgram(this.program);
        // 删除fragment shader
        if (this.fragmentShader) {
            this.gl.detachShader(this.program, this.fragmentShader);
            this.gl.deleteShader(this.fragmentShader);
            // 删除texture
            this.gl.deleteTexture(this.texture);
        }
        // 更新
        this.fragmentShader = this.initShader(code, 'fragment');
        return true;
    }

    /**
     * 创建并绑定framebuffer, 之后attach a texture
     * @param {WebGLTexture} texture 材质
     * @returns {WebGLFramebuffer} The framebuffer
     */
    attachFrameBuffer(texture) {
        const gl = this.gl;
        let frameBuffer;
        frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, // The target is always a FRAMEBUFFER.
            gl.COLOR_ATTACHMENT0, // We are providing the color buffer.
            gl.TEXTURE_2D, // This is a 2D image texture.
            texture, // The texture.
            0 // 0, we aren't using MIPMAPs
        );

        return frameBuffer;
    }

    /**
     * Check the framebuffer status. Return false if the framebuffer is not complete,
     * That is if it is not fully and correctly configured as required by the current
     * hardware. True indicates that the framebuffer is ready to be rendered to.
     *
     * @returns {boolean} True if the framebuffer is ready to be rendered to. False if not.
     */
    frameBufferIsComplete() {
        let gl = this.gl;
        let message;
        let status;
        let value;

        status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        switch (status)
        {
            case gl.FRAMEBUFFER_COMPLETE:
                message = "Framebuffer is complete.";
                value = true;
                break;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                message = "Framebuffer is unsupported";
                value = false;
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                message = "Framebuffer incomplete attachment";
                value = false;
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                message = "Framebuffer incomplete (missmatched) dimensions";
                value = false;
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                message = "Framebuffer incomplete missing attachment";
                value = false;
                break;
            default:
                message = "Unexpected framebuffer status: " + status;
                value = false;
        }
        return {isComplete: value, message: message};
    }

    /**
     * 更新材质
     * @param {WebGLTexture}    texture 材质对象
     * @param {number}          type    材质类型. FLOAT, UNSIGNED_BYTE, etc.
     * @param {Float32Array[]}        data    材质数据
     */
    refreshTexture(texture, type, data) {
        const gl = this.gl;
        // Bind the texture so the following methods effect it.
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Replace the texture data
        gl.texSubImage2D(gl.TEXTURE_2D, // Target, matches bind above.
            0,             // Level of detail.
            0,             // xOffset
            0,             // yOffset
            this.dim,  // Width - normalized to s.
            this.dim, // Height - normalized to t.
            gl.RGBA,       // Format for each pixel.
            type,          // Data type for each chanel.
            data);         // Image data in the described format.

        // Unbind the texture.
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    /**
     * 初始化材质
     * @param {int} index 材质索引
     * @param {string} tSampler 材质名称
     * @param {Object} bufferData 数据
     */
    initTexture(index, tSampler, bufferData) {
        const gl = this.gl;
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${index}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.FLOAT, bufferData);
        /*gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.dim, this.dim, 0,
            gl.RGBA, gl.FLOAT, bufferData, 0);*/
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, bufferData);
        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.opts.o_length || this.dim, this.opts.o_length || this.dim, 0,
            gl.RGBA, gl.FLOAT, bufferData, 0);
        gl.uniform1i(this.getUniformLoc(tSampler), index);
    }

    getUniformLoc(name) {
        let loc = this.gl.getUniformLocation(this.program, name);
        if (loc === null) throw `getUniformLoc ${name} err`;
        return loc;
    }

    makeTexure(type, data) {
        const gl = this.gl;
        let texture = this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // Pixel format and data for the texture
        gl.texImage2D(gl.TEXTURE_2D, // Target, matches bind above.
            0,             // Level of detail.
            gl.RGBA,       // Internal format.
            this.dim,         // Width - normalized to s.
            this.dim,        // Height - normalized to t.
            0,             // Always 0 in OpenGL ES.
            gl.RGBA,       // Format for each pixel.
            type,          // Data type for each chanel.
            data);         // Image data in the described format, or null.
        // Unbind the texture.
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    render(bufferA, bufferB, type = 'texture') {
        const gl = this.gl;
        const program = this.program;
        if (type === 'texture') {
            if (!!bufferA) {
                this.initTexture(0, 'mapA', bufferA);
            }
            if (!!bufferB) {
                this.initTexture(1, 'mapB', bufferB);
            }
        } else {
            // const locFilter = this.getUniformLoc('filter');
            // this.gl.uniform1fv(locFilter, bufferA);
            this.initTexture(0, 'origin', bufferB);
            const locFilter = this.getUniformLoc('filter');
            this.gl.uniform1fv(locFilter, bufferA);
            /*const locOri = this.getUniformLoc('origin');
            this.gl.uniform1f(locOri, bufferB);*/
        }
        // gl.useProgram(program);
        // 绘制
        // gl.clearColor(.2, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.clearColor(.0, .0, .0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    compute() {
        let gl = this.gl;

        let pixels = new Float32Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        console.dir(['framebuffer状态', this.frameBufferIsComplete()]);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.FLOAT, pixels, 0);

        return pixels;
    }

    dispose() {
        this.gl.deleteProgram(this.program);
    }
}
