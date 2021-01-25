import { Runner } from "@paddlejs/paddlejs-core/src";
import { GLOBALS } from '@paddlejs/paddlejs-core/src/globals';
import '../../paddlejs-backend-cpu/src/index';
import env from "@paddlejs/paddlejs-core/src/env";
import * as express from 'express';
import * as aes from  'aes-js';
import { join } from 'path';

const app = express();

app.use(express.static(join(__dirname, 'public')));

// const modelPath = 'https://paddlejs.cdn.bcebos.com/models/tinyYolo/model.json';
const modelPath = 'http://localhost:3000/model.json';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function (_, res) {
	res.render('index', {
		modelPath
	});
});

app.get('/model', async function(_, res) {

    env.set('platform', 'node');

    let fetchTensorName = '';

    GLOBALS.backendInstance.read = function (fetchInfo) {
        fetchTensorName = fetchInfo.name;
    }

	const runner = new Runner({
		modelPath,
		feedShape: {
			fw: 320,
			fh: 320
		},
		targetSize: {
			width: 320,
			height: 320
		},
		fileCount: 0
    });


    // GLOBALS.backendInstance = {
    //     init(): void {
    //         this.status = 'init';
    //     },

    //     createProgram(): string {
    //         return 'mock program';
    //     },

    //     runProgram(): void {
    //         this.status = 'run op program';
    //     },

    //     read(): Float32Array | number[] {
    //         this.status = 'complete';
    //         return [1, 1, 1, 1];
    //     }
    // };

	await runner.load();
    await runner.genGraph();
    await runner.preheat();

	const key = new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]);
    const iv = new Uint8Array([ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ]);

    const aesCTR = new aes.ModeOfOperation.ctr(key, iv);
    // const encryptedBytes = aesCTR.encrypt(aes.utils.utf8.toBytes(connectOps(runner.weightMap) + '==|==' + JSON.stringify(runner.model.vars)));
    const encryptedBytes = aesCTR.encrypt(aes.utils.utf8.toBytes(fetchTensorName + '#' + connectOps(runner.weightMap)));
    // console.log(encryptedBytes)
    res.end(aes.utils.hex.fromBytes(encryptedBytes));

});

function connectOps(weightMap) {
    const result =  weightMap.filter(op => {
        return op?.opData?.tensorData ? JSON.stringify(op.opData.tensorData) : false;
    }).map(op => {
        const tensorData = op.opData.tensorData.map(tensor => {
            if (tensor.data) {
                tensor.data =  Array.from(tensor.data);
            }

            if (tensor.tensorName === 'filter') {
                console.log(JSON.stringify(tensor));
            }
            return tensor;
        });

        // const attrs = op.OpData.attrs;
        // return JSON.stringify({
        //     ...tensorData,
        //     shape: JSON.stringify(shape),
        //     data: data
        // });
        return {tensorData, attrs: op.attrs};
    });

    return JSON.stringify(result);
}


app.listen(3000);
console.log('Server started on port 3000');
