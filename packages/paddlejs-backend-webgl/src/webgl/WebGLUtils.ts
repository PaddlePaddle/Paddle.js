/**
 * @file webgl utils
 * @author yueshuangyan
 */

import { env } from 'paddlejs-core/src';
import { WebGLContextAttributes } from './webgl_types';

// 枚举类
export enum EShaderType
{
    VS_SHADER,
    FS_SHADER
}

export enum EGLSLESDataType
{
    FLOAT_VEC2 = 0x8B50,
    FLOAT_VEC3,
    FLOAT_VEC4,
    INT_VEC2,
    INT_VEC3,
    INT_VEC4,
    BOOL,
    BOOL_VEC2,
    BOOL_VEC3,
    BOOL_VEC4,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    SAMPLER_2D,
    SAMPLER_CUBE,

    FLOAT = 0x1406,
    INT = 0x1404
}

export class GLUniformInfo {
    public size: number; // size 是指type的个数，切记
    public type: EGLSLESDataType; // type 是Uniform Type，而不是DataType
    public location: WebGLUniformLocation;

    public constructor(size: number, type: number, loc: WebGLUniformLocation) {
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}

export class GLAttribInfo {
    public size: number; // size 是指type的个数，切记
    public type: EGLSLESDataType; // type 是Uniform Type，而不是DataType
    public location: number;

    public constructor(size: number, type: number, loc: number) {
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}

export type GLUniformMap = { [ key: string ]: GLUniformInfo };
export type GLAttribMap = { [ key: string ]: GLAttribInfo };


export class GLHelper {

    public static WEBGL_ATTRIBUTES: WebGLContextAttributes = {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };

    public static getWebglVersion() {
        return env.get('webglVersion');
    }

    public static createCanvas() {
        return document.createElement('canvas');
    }

    public static getWebGLRenderingContext(): WebGLRenderingContext {
        const canvas = this.createCanvas();

        canvas.addEventListener('webglcontextlost', (ev: Event) => {
            ev.preventDefault();
            throw Error('webgl context is lost~');
        }, false);

        let gl = canvas.getContext('webgl2', this.WEBGL_ATTRIBUTES) as WebGLRenderingContext | null;
        if (gl) {
            env.set('webglVersion', 2);
        }
        else {
            env.set('webglVersion', 1);
            gl = (canvas.getContext('webgl', this.WEBGL_ATTRIBUTES)
                || canvas.getContext('experimental-webgl', this.WEBGL_ATTRIBUTES)) as WebGLRenderingContext;
        }

        return gl as WebGLRenderingContext;
    }


    public static printStates(gl: WebGLRenderingContext): void {
        // 所有的boolean状态变量，共9个
        console.log('1. isBlendEnable = ' + gl.isEnabled(gl.BLEND));
        console.log('2. isCullFaceEnable = ' + gl.isEnabled(gl.CULL_FACE));
        console.log('3. isDepthTestEnable = ' + gl.isEnabled(gl.DEPTH_TEST));
        console.log('4. isDitherEnable = ' + gl.isEnabled(gl.DITHER));
        console.log('5. isPolygonOffsetFillEnable = ' + gl.isEnabled(gl.POLYGON_OFFSET_FILL));
        console.log('6. isSampleAlphtToCoverageEnable = ' + gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE));
        console.log('7. isSampleCoverageEnable = ' + gl.isEnabled(gl.SAMPLE_COVERAGE));
        console.log('8. isScissorTestEnable = ' + gl.isEnabled(gl.SCISSOR_TEST));
        console.log('9. isStencilTestEnable = ' + gl.isEnabled(gl.STENCIL_TEST));
    }

    public static printWebGLInfo(gl: WebGLRenderingContext): void {
        console.log('renderer = ' + gl.getParameter(gl.RENDERER));
        console.log('version = ' + gl.getParameter(gl.VERSION));
        console.log('vendor = ' + gl.getParameter(gl.VENDOR));
        console.log('glsl version = ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    }

    public static printWebGLTextureInfo(gl: WebGLRenderingContext): void {
        console.log('MAX_COMBINED_TEXTURE_IMAGE_UNITS = ', gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
        console.log('MAX_TEXTURE_IMAGE_UNITS = ', gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
        console.log('MAX_TEXTURE_SIZE = ', gl.getParameter(gl.MAX_TEXTURE_SIZE));
        console.log('MAX_CUBE_MAP_TEXTURE_SIZE = ', gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
    }

    public static triggerContextLostEvent(gl: WebGLRenderingContext): void {
        const ret = gl.getExtension('WEBGL_lose_context');
        if (ret !== null) {
            ret.loseContext();
        }
    }

    public static checkGLError(gl: WebGLRenderingContext): boolean {
        const err: number = gl.getError();
        if (err === 0) {
            return false;
        }

        console.log('WebGL Error NO: ', err);
        return true;

    }

    public static setDefaultState(gl: WebGLRenderingContext): void {
        // default [r=0,g=0,b=0,a=0]
        gl.clearColor(0.0, 0.0, 0.0, 0.0); // 每次清屏时，将颜色缓冲区设置为全透明黑色
        gl.clearDepth(1.0); // 每次清屏时，将深度缓冲区设置为1.0
        gl.enable(gl.DEPTH_TEST); // 开启深度测试
        gl.enable(gl.CULL_FACE); // 开启背面剔除
        gl.enable(gl.SCISSOR_TEST); // 开启裁剪测试
    }

    public static setViewport(gl: WebGLRenderingContext, v: number[]): void {
        gl.viewport(v[0], v[1], v[2], v[3]);
    }

    public static initShader(gl: WebGLRenderingContext, type: EShaderType, code: string): WebGLShader {
        const shader = this.createShader(gl, type);
        this.compileShader(gl, code, shader);
        return shader;
    }

    public static createShader(gl: WebGLRenderingContext, type: EShaderType): WebGLShader {
        let shader: WebGLShader | null = null;
        if (type === EShaderType.VS_SHADER) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        if (shader === null) {
            // 如果创建WebGLShader对象失败，我们采取抛错错误的处理方式
            throw new Error('WebGLShader创建失败！');
        }
        return shader;
    }

    public static compileShader(gl: WebGLRenderingContext, code: string, shader: WebGLShader): boolean {
        gl.shaderSource(shader, code); // 载入shader源码
        gl.compileShader(shader); // 编译shader源码
        // 检查编译错误
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
            // 如果编译出现错误，则弹出对话框，了解错误的原因
            console.error(gl.getShaderInfoLog(shader));
            // 然后将shader删除掉，防止内存泄漏
            gl.deleteShader(shader);
            // 编译错误返回false
            return false;
        }
        // 编译成功返回true
        return true;
    }

    public static createProgram(gl: WebGLRenderingContext): WebGLProgram {
        const program: WebGLProgram | null = gl.createProgram();
        if (program === null) {
            // 直接抛出错误
            throw new Error('WebGLProgram创建失败！');
        }
        return program;
    }

    public static linkProgram(
        gl: WebGLRenderingContext, // 渲染上下文对象
        program: WebGLProgram, // 链接器对象
        vsShader: WebGLShader, // 要链接的顶点着色器
        fsShader: WebGLShader, // 要链接的片段着色器
        beforeProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null,
        afterProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null): boolean {

        // 1、使用attachShader方法将顶点和片段着色器与当前的连接器相关联
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);

        // 2、在调用linkProgram方法之前，按需触发beforeProgramLink回调函数
        if (beforeProgramLink !== null) {
            beforeProgramLink(gl, program);
        }

        // 3、调用linkProgram进行链接操作
        gl.linkProgram(program);
        // 4、使用带gl.LINK_STATUS参数的getProgramParameter方法，进行链接状态检查
        if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
            // 4.1 如果链接出错，调用getProgramInfoLog方法将错误信息以弹框方式通知调用者
            console.error(gl.getProgramInfoLog(program));
            // 4.2 删除掉相关资源，防止内存泄漏
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            // 4.3 返回链接失败状态
            return false;
        }


        // 5、使用validateProgram进行链接验证
        gl.validateProgram(program);
        // 6、使用带gl.VALIDATE_STATUS参数的getProgramParameter方法，进行验证状态检查
        if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
            // 6.1 如果验证出错，调用getProgramInfoLog方法将错误信息以弹框方式通知调用者
            console.error(gl.getProgramInfoLog(program));
            // 6.2 删除掉相关资源，防止内存泄漏
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            // 6.3 返回链接失败状态
            return false;
        }


        // 7、全部正确，按需调用afterProgramLink回调函数
        if (afterProgramLink !== null) {
            afterProgramLink(gl, program);
        }

        // 8、返回链接正确表示
        return true;
    }


    public static getProgramActiveAttribs(gl: WebGLRenderingContext, program: WebGLProgram, out: GLAttribMap): void {
        // 获取当前active状态的attribute和uniform的数量
        // 很重要一点，active_attributes/uniforms必须在link后才能获得
        const attributsCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        // 很重要一点，所谓active是指uniform已经被使用的，否则不属于uniform,uniform在shader中必须是读取，不能赋值
        // 很重要一点，attribute在shader中只能读取，不能赋值,如果没有被使用的话，也是不算入activeAttrib中去的
        for (let i = 0; i < attributsCount; i++) {
            const info: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
            if (info) {
                out[info.name] = new GLAttribInfo(info.size, info.type, gl.getAttribLocation(program, info.name));
            }
        }
    }

    public static getProgramAtciveUniforms(gl: WebGLRenderingContext, program: WebGLProgram, out: GLUniformMap): void {
        const uniformsCount: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformsCount; i++) {
            const info: WebGLActiveInfo | null = gl.getActiveUniform(program, i);
            if (info) {
                const loc: WebGLUniformLocation | null = gl.getUniformLocation(program, info.name);
                if (loc !== null) {
                    out[info.name] = new GLUniformInfo(info.size, info.type, loc);
                }
            }
        }
    }

    public static createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
        const buffer: WebGLBuffer | null = gl.createBuffer();
        if (buffer === null) {
            throw new Error('WebGLBuffer创建失败！');
        }
        return buffer;
    }

    public static getColorBufferData(gl: WebGLRenderingContext): Uint8Array {
        const pixels: Uint8Array = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    }
}
