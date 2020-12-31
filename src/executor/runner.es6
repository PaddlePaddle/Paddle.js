/**
 * @file Runner 整个流程封装一下
 * @author hantian(hantianjiao@baidu.com), wangqungit push origin master:refs/for/master
 * 使用方法：
 * const runner = new Runner({
 *      modelName: 'separate' // '608' | '320' | '320fused' | 'separate'
 *  });
 *  runner.preheat().then(r => {
 *      r.run(document.getElementById('test'));
 *  });
 */
import IO from '../feed/ImageFeed';
import DataFeed from '../feed/dataFeed';
import PostProcess from './postProcess';
import Logger from '../../tools/logger';
import Paddle from '../paddle/paddle';
import Utils from '../utils/utils';
// const fileDownload = require('js-file-download');
window.log = new Logger();

export default class Runner {
    // 加载模型&预热
    constructor(options) {
        const opts = {
            needPostProcess: false,
            needPreheat: true,
            inputType: 'image'
        };
        this.modelConfig = Object.assign(opts, options); // models[options.modelName];
        this.flags = {
            isRunning: false,
            isPreheating: false,
            runVideoPaused: false
        };
        this.buffer = new Float32Array();
        this.io = new IO();
        this.model = null;
        this.preheatFeed = null;
        if (this.modelConfig.needPostProcess) {
            this.postProcess = new PostProcess(options);
        }
    }

    async loadModel() {
        const options = this.modelConfig;
        let path = options.modelPath;

        if (path.charAt(path.length - 1) !== '/') {
            path += '/';
        }
        const MODEL_CONFIG = {
            dir: path.indexOf('http') === 0 ? path : `/${path}`, // 存放模型的文件夹
            main: 'model.json', // 主文件
        };
        const paddle = new Paddle({
            urlConf: MODEL_CONFIG,
            options: {
                multipart: true,
                dataType: 'binary',
                options: {
                    fileCount: options.fileCount, // 切成了多少文件
                    getFileName(i) { // 获取第i个文件的名称
                        return `chunk_${i}.dat`;
                    }
                }
            }
        });

        this.model = await paddle.load();
        if (!options.needPreheat) {
            return;
        }
        await this.preheat();
    }
    async checkModelLoaded() {
        if (!this.model) {
            console.info('It\'s better to preheat the model before running.');
            await this.loadModel();
        }
    }
    // 预热 用用空数据跑一遍
    async preheat() {
        await this.checkModelLoaded();
        this.flags.isPreheating = true;
        let {fh, fw} = this.modelConfig.feedShape;
        let feed = this.preheatFeed = [{
            data: new Float32Array(3 * fh * fw).fill(5.0),
            name: 'image',
            shape: [1, 3, fh, fw]
        }];

        const inst = this.model.execute({
            input: feed
        });

        await this.runAfter(inst);
        this.flags.isPreheating = false;
        return this;
    }

    // 跑一遍
    async run(input, callback) {
        this.flags.isRunning = true;
        const options = this.modelConfig;
        let {fh, fw} = options.feedShape;

        const {inputType = 'image', fill, targetSize, scale, mean, std} = options;
        let feed;
        switch (inputType) {
            case 'video':
                feed = [
                    {
                        data: input,
                        shape: [1, 3, fh, fw],
                        name: 'image'
                    }
                ];
                break;
            case 'image':
                feed = this.io.process({
                    input: input,
                    params: {
                        gapFillWith: fill || '#000', // 缩放后用什么填充不足方形部分
                        targetSize: targetSize, // { height: fw, width: fh}
                        scale: scale, // 缩放尺寸
                        targetShape: [1, 3, fh, fw], // 目标形状 为了兼容之前的逻辑所以改个名
                        mean: mean || [0, 0, 0], // 预设期望
                        std: std || [1, 1, 1]  // 预设方差
                    }
                });
                break;
        }

        await this.runWithFeed(feed, callback);
    }

    async runAfter(inst) {
        let result = await inst.read();
        let fetchShape = this.modelConfig.fetchShape;
        let N = fetchShape[0];
        let C = fetchShape[1];
        let H = fetchShape[2];
        let W = fetchShape[3];
        let nhwcShape = [N, H, W, C];

        let nchwData = Utils.nhwc2nchw(result, nhwcShape);
        Utils.stridePrint(nchwData);
        Utils.continuousPrint(nchwData);

        // fileDownload(nchwData, `paddle.txt`);
        return nchwData;
    }

    async runWithFeed(feed, callback) {
        await this.checkModelLoaded();
        let inst = this.model.execute({
            input: feed
        });
        const nchwData = await this.runAfter(inst);

        await callback && callback(nchwData);

        this.flags.isRunning = false;
    }

    // 传入获取图片的function
    async runStream(getMedia, callback) {
        const result = await this.run(getMedia, callback);
        if (this.modelConfig.inputType === 'video' && !this.flags.runVideoPaused) {
            setTimeout(async () => {
                await this.runStream(getMedia, callback);
            }, 0);
        }

        return result;
    }

    stopStream() {
        this.flags.runVideoPaused = true;
    }

    async predict(getMedia, callback) {
        this.flags.runVideoPaused = false;
        if (typeof getMedia === 'function') {
            await this.runStream(getMedia(), callback);
        } else {
            await this.runStream(getMedia, callback);
        }

    }
}

window.Paddle = Runner;
