/**
 * @file Loader，model加载器
 */

import env from './env';
import { Model } from './commons/interface';
import { traverseVars } from './commons/utils';

interface UrlConf {
    dir: string;
    main: string;
}

interface FetchParams {
    type: string;
    method?: string;
    mode?: string;
}

export default class ModelLoader {
    urlConf: UrlConf = {
        dir: '',
        main: ''
    };

    separateChunk: boolean = true;
    chunkNum: number = 1;
    dataType: string = 'binary';
    params: FetchParams = {
        type: 'fetch'
    };

    inNode: boolean = false;
    isLocalFile: boolean = false;
    realFetch: Function = function () {
        throw new Error('ERROR: empty fetch funciton');
    };

    constructor(modelPath: string) {
        let modelDir = '';
        let filename = 'model.json';
        if (modelPath.endsWith('.json')) {
            const dirPosIndex = modelPath.lastIndexOf('/') + 1;
            modelDir = modelPath.substr(0, dirPosIndex);
            filename = modelPath.substr(dirPosIndex);
        }
        else if (modelPath.charAt(modelPath.length - 1) !== '/') {
            modelDir = `${modelPath}/`;
        }

        this.isLocalFile = modelDir.indexOf('http') !== 0;

        this.urlConf = {
            dir: this.isLocalFile
                ? modelDir.charAt(0) === '/'
                    ? `${modelDir}`
                    : `/${modelDir}`
                : modelDir,
            main: filename // 主文件
        };

        this.inNode = env.get('platform') === 'node';
    }

    async load() {
        const modelInfo: Model = await this.fetchModel();
        this.separateChunk = !!modelInfo.chunkNum && modelInfo.chunkNum > 0;
        this.chunkNum = this.separateChunk ? modelInfo.chunkNum : 0;

        if (this.separateChunk) {
            if (this.dataType === 'binary') {
                await this.fetchChunks().then(allChunksData =>
                    ModelLoader.allocateParamsVar(modelInfo.vars, allChunksData)
                );
            }
        }
        return modelInfo;
    }

    async fetchOneChunk(path: string) {
        if (env.get('fetch')) {
            return await env.get('fetch')(path, { type: 'arrayBuffer' });
        };
        return this.fetch(path).then(request => {
            return request.arrayBuffer();
        });
    }

    fetchJson(path: string) {
        return this.fetch(path).then(request => {
            return request.json();
        });
    }

    getFileName(i: number | string) {
        // 获取第i个文件的名称
        return `chunk_${i}.dat`;
    }

    async fetchChunks() {
        const counts = this.chunkNum;
        const chunkArray: any[] = [];
        for (let i = 1; i <= counts; i++) {
            chunkArray.push(
                this.fetchOneChunk(this.urlConf.dir + this.getFileName(i))
            );
        }
        return Promise.all(chunkArray).then(chunks => {
            let chunksLength = 0;
            const f32Array: any[] = [];
            let float32Chunk;
            chunks.forEach(i => {
                float32Chunk = new Float32Array(i);
                f32Array.push(float32Chunk);
                chunksLength += float32Chunk.length;
            });
            const allChunksData = new Float32Array(chunksLength);
            let offset = 0;
            f32Array.forEach(i => {
                i.forEach((num: any) => {
                    allChunksData[offset] = num;
                    offset += 1;
                });
            });
            return allChunksData;
        });
    }

    static allocateParamsVar(vars, allChunksData: Float32Array) {
        let marker = 0; // 读到哪个位置了
        let len; // 当前op长度
        traverseVars(vars, item => {
            len = item.shape.reduce((a, b) => a * b); // 长度为shape的乘积
            // 为了减少模型体积，模型转换工具不会导出非persistable的数据，这里只需要读取persistable的数据
            if (item.persistable) {
                item.data = allChunksData.slice(marker, marker + len);
                marker += len;
            }
        });
    }

    fetch(path: string, params?: FetchParams) {
        if (env.get('fetch')) {
            return env.get('fetch')(path, params || {});
        }
        const fetchParams = params || this.params;
        const method = fetchParams.method || 'get';
        const HeadersClass = this.inNode
            ? require('node-fetch').Headers
            : Headers;
        const myHeaders = new HeadersClass();
        this.realFetch = this.inNode
            ? this.isLocalFile
                ? this.fetchLocalFile
                : require('node-fetch')
            : window.fetch.bind(window);

        return this.realFetch(path, {
            method: method,
            headers: myHeaders
        });
    }

    fetchLocalFile(localPath) {
        const fs = require('fs');
        return new Promise((resolve, reject) => {
            try {
                const content = fs.readFileSync(localPath, 'utf8');
                resolve(content);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    fetchModel() {
        const params = this.params;
        const path = this.urlConf.dir + this.urlConf.main;
        let load: any = null;
        // 原生fetch
        if (params.type === 'fetch') {
            load = new Promise((resolve, reject) => {
                this.fetch(path, params)
                    .then(response => {
                        if (env.get('fetch')) {
                            return response;
                        }
                        return this.isLocalFile && this.inNode
                            ? JSON.parse(response)
                            : response.json();
                    })
                    .then(responseData => resolve(responseData))
                    .then(err => reject(err));
            });
        }

        return load;
    }
}
