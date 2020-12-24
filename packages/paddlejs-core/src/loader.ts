/**
 * @file Loader，model加载器
 */

interface UrlConf {
    dir: string;
    main: string;
}

interface FetchParams {
    type: string;
    method?: string;
    mode?: string;
}

interface ModelVars {
    name: string;
    shape: number[];
    data?: number[] | Float32Array;
    persistable?: boolean;
}

export default class ModelLoader {
    urlConf: UrlConf = {
        dir: '',
        main: ''
    };

    multipart = false;
    chunkNum = 0;
    dataType = 'binary';
    params: FetchParams = {
        type: 'fetch'
    };

    constructor(modelPath: string, fileCount: number = 1) {
        let modelDir = '';
        let filename = 'model.json';
        if (modelPath.endsWith('.json')) {
            const dirPosIndex = modelPath.lastIndexOf('/') + 1;
            modelDir = modelPath.substr(0, dirPosIndex);
            filename = modelPath.substr(dirPosIndex);
        }
        else if (modelPath.charAt(modelPath.length - 1) !== '/') {
            modelDir += '/';
        }

        this.urlConf = {
            dir: modelDir.indexOf('http') === 0 // 存放模型的文件夹
                ? modelDir
                : modelDir.charAt(0) === '/'
                    ? `${modelDir}`
                    : `/${modelDir}`,
            main: filename // 主文件
        };

        this.multipart = fileCount > 1;
        this.dataType = 'binary';
        this.chunkNum = fileCount;
    }

    async load() {
        const modelInfo: any = await this.fetchModel();
        if (this.multipart === true) {
            if (this.dataType === 'binary') {
                await this.fetchChunks()
                    .then(allChunksData => this.traverse(modelInfo.vars, allChunksData));
            }
        }
        return modelInfo;
    }

    fetchOneChunk(path: string) {
        return this.fetch(path).then(request => {
            return request.arrayBuffer();
        });
    }

    fetchJson(path: string) {
        return this.fetch(path).then(request => {
            return request.json();
        });
    }

    getFileName(i: number | string) { // 获取第i个文件的名称
        return `chunk_${i}.dat`;
    }

    fetchChunks() {
        const counts = this.chunkNum;
        const chunkArray: any[] = [];
        for (let i = 1; i <= counts; i++) {
            chunkArray.push(
                this.fetchOneChunk(this.urlConf.dir + this.getFileName(i))
            );
        }
        // console.time('加载时间');
        return Promise.all(chunkArray).then(chunks => {
            // console.timeEnd('加载时间');
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


    traverse(arr: ModelVars[], allChunksData: Float32Array) {
        let marker = 0; // 读到哪个位置了
        let len; // 当前op长度
        arr.filter(item => {
            return item.name;
        })
            .forEach(item => {
                len = item.shape.reduce((a, b) => a * b); // 长度为shape的乘积
                // 为了减少模型体积，模型转换工具不会导出非persistable的数据，这里只需要读取persistable的数据
                if (item.persistable) {
                    item.data = allChunksData.slice(marker, marker + len);
                    marker += len;
                }
            });
    }

    fetch(path: string, params?: FetchParams) {
        const fetchParams = params || this.params;
        const method = fetchParams.method || 'get';

        const myHeaders = new Headers();
        return fetch(path, {
            method: method,
            headers: myHeaders
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
                    .then(response => response.json())
                    .then(responseData => resolve(responseData))
                    .then(err => reject(err));
            });
        }

        return load;
    }

}

