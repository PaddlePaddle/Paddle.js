import { env } from '@paddlejs/paddlejs-core';

export enum EGLTexWrapType {
    GL_REPEAT, // 设置为gl对应的常量
    GL_MIRRORED_REPEAT,
    GL_CLAMP_TO_EDGE
}

export interface TextureConfig {
    textureFloat: number;
    textureHalfFloat: number | null;
    internalFormat: number;
    internalFormatPacked: number;
    textureFormat: number;
    internalFormatPackedHalfFloat: number;
    internalFormatHalfFloat: number;
    downloadInternalFormat: number;
    frameBufferSupportFloat: boolean;
    isFloatTextureReadPixelsEnabled: boolean;
}

export class GLTexture {
    public static getTextureConfig(webgl: WebGLRenderingContext): TextureConfig {
        const gl = webgl as any;
        let textureFloat: number;
        let textureFormat: number;
        let textureHalfFloat: number | null;
        let internalFormat: number;
        let internalFormatPacked: number;
        let internalFormatHalfFloat: number;
        let internalFormatPackedHalfFloat: number;
        let downloadInternalFormat: number;
        let frameBufferSupportFloat: boolean = true;
        let isFloatTextureReadPixelsEnabled: boolean = true;

        if (env.get('webglVersion') === 2) {
            textureFloat = gl.getExtension('EXT_color_buffer_float');
            textureHalfFloat = gl.HALF_FLOAT;
            internalFormat = gl.R32F;
            internalFormatPacked = gl.RGBA32F;
            internalFormatHalfFloat = gl.R16F;
            internalFormatPackedHalfFloat = gl.RGBA16F;
            textureFormat = gl.RED;
            downloadInternalFormat = gl.RGBA32F;
        }
        else {
            internalFormat = gl.RGBA;
            internalFormatHalfFloat = gl.RGBA;
            internalFormatPackedHalfFloat = gl.RGBA;
            internalFormatPacked = gl.RGBA;
            textureFormat = gl.RGBA;
            downloadInternalFormat = gl.RGBA;
            const TEXTURE_FLOAT = 'OES_texture_float';
            const TEXTURE_HALF_FLOAT = 'OES_texture_half_float';
            textureFloat = gl.getExtension(TEXTURE_FLOAT);
            textureHalfFloat = gl.getExtension(TEXTURE_HALF_FLOAT).HALF_FLOAT_OES;
            frameBufferSupportFloat = this.isDownloadFloatTextureEnabled(gl, downloadInternalFormat);
            isFloatTextureReadPixelsEnabled = this.isFloatTextureReadPixelsEnabledMethod(
                gl,
                1, // gl version
                frameBufferSupportFloat
            );
        }

        return {
            textureFloat,
            textureHalfFloat,
            internalFormat,
            internalFormatPacked,
            internalFormatHalfFloat,
            internalFormatPackedHalfFloat,
            textureFormat,
            downloadInternalFormat,
            frameBufferSupportFloat,
            isFloatTextureReadPixelsEnabled
        };
    }

    public static isFloatTextureReadPixelsEnabledMethod(
        webgl: WebGLRenderingContext,
        webGLVersion,
        frameBufferSupportFloat
    ) {
        const gl = webgl as any;
        if (webGLVersion === 0) {
            return false;
        }

        if (webGLVersion === 1) {
            if (gl.getExtension('OES_texture_float') == null) {
                return false;
            }
        }
        else {
            if (gl.getExtension('EXT_color_buffer_float') == null
            || gl.getExtension('EXT_color_buffer_half_float') == null) {
                return false;
            }
        }

        const frameBuffer = gl.createFramebuffer();
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        const internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            internalFormat,
            1,
            1,
            0,
            gl.RGBA,
            frameBufferSupportFloat ? gl.FLOAT : gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES,
            null
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        const frameBufferComplete
            = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));

        const readPixelsNoError = gl.getError() === gl.NO_ERROR;

        return frameBufferComplete && readPixelsNoError;
    }

    // 判断当前frameBuffer能否支持 float texture
    public static isDownloadFloatTextureEnabled(gl: WebGLRenderingContext, downloadInternalFormat: number) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const width = 1;
        const height = 1;
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            downloadInternalFormat,
            width,
            height,
            0,
            gl.RGBA,
            gl.FLOAT,
            null
        );
        const frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const isFrameBufferComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(frameBuffer);
        return isFrameBufferComplete;
    }

    /**
     * 初始化材质
     * @param {int} index 材质索引
     * @param {string} tSampler 材质名称
     * @param {Object} bufferData 数据
     * @param {boolean} isRendered 是否已运行过
     */
    public static initTexture(gl: WebGLRenderingContext, index: number, textureInfo: any) {
        const textureConf = this.getTextureConfig(gl);
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${index}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (textureInfo) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (env.get('webglVersion') === 2) {
                gl.texImage2D(gl.TEXTURE_2D,
                    0,
                    textureConf.internalFormat,
                    textureInfo.width_texture,
                    textureInfo.height_texture,
                    0,
                    textureConf.textureFormat,
                    gl.FLOAT,
                    textureInfo.data
                );
            }
            else {
                const temp = new Float32Array(textureInfo.width_texture * textureInfo.height_texture * 4);
                for (let i = 0; i < textureInfo.data.length; i++) {
                    temp[i * 4] = (textureInfo.data[i]);
                    temp[i * 4 + 1] = 0;
                    temp[i * 4 + 2] = 0;
                    temp[i * 4 + 3] = 0;
                }
                gl.texImage2D(gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    textureInfo.width_texture,
                    textureInfo.height_texture,
                    0,
                    gl.RGBA,
                    gl.FLOAT,
                    temp
                );
            }
        }

        return texture;
    }

    public static genOutputTexture(gl, textureConf, outTensor, isFinalOp): WebGLTexture {
        const {
            interpType,
            width_texture,
            height_texture
        } = outTensor;
        // 生成output的texture缓存
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, interpType === 'LINEAR' ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, interpType === 'LINEAR' ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const useHalfFloat = env.get('webgl_force_half_float_texture');
        const internalFormat = useHalfFloat
            ? textureConf.internalFormatPackedHalfFloat // webgl: 2.0 gl.RGBA16F, 1.0 gl.RGBA
            : textureConf.internalFormatPacked; // webgl: 2.0 gl.RGBA32F, 1.0 gl.RGBA

        const textureType = env.get('webglVersion') === 2
            ? useHalfFloat
                ? gl.HALF_FLOAT
                : gl.FLOAT
            : textureConf.frameBufferSupportFloat
                ? gl.FLOAT
                : textureConf.textureHalfFloat;

        const textureTypeForReadPixel = isFinalOp
            ? textureConf.isFloatTextureReadPixelsEnabled
                ? textureType
                : gl.UNSIGNED_BYTE
            : null;


        gl.texImage2D(
            gl.TEXTURE_2D, // Target, matches bind above.
            0, // Level of detail.
            internalFormat, // Internal format.
            width_texture,
            height_texture,
            0, // Always 0 in OpenGL ES.
            gl.RGBA, // Format for each pixel.
            isFinalOp ? textureTypeForReadPixel : textureType, // Data type for each chanel.
            null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}
