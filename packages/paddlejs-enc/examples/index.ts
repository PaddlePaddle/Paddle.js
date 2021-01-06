import { Runner } from "../../paddlejs-core/src";
import { GLOBALS } from '../../paddlejs-core/src/globals';
import env from "../../paddlejs-core/src/env";
import * as express from 'express';
import * as aes from  'aes-js';
import { join } from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

// const modelPath = 'https://paddlejs.cdn.bcebos.com/models/tinyYolo/model.json';
const modelPath = 'http://localhost:3000/model.json';

app.get('/', function (_, res) {
	res.render('index', {
		modelPath
	});
});

app.get('/model', async function(_, res) {

    env.set('platform', 'node');

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

    GLOBALS.backendInstance = {
        init(): void {
            this.status = 'init';
        },

        createProgram(): string {
            return 'mock program';
        },

        runProgram(): void {
            this.status = 'run op program';
        },

        read(): Float32Array | number[] {
            this.status = 'complete';
            return [1, 1, 1, 1];
        }
    };

	await runner.load();
    runner.genGraph();
    runner.preheat();

    // console.info(runner.weightMap);


	const key = new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]);
    const iv = new Uint8Array([ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ]);

    const aesCTR = new aes.ModeOfOperation.ctr(key, iv);
    // const encryptedBytes = aesCTR.encrypt(aes.utils.utf8.toBytes(connectOps(runner.weightMap) + '==|==' + JSON.stringify(runner.model.vars)));
    const encryptedBytes = aesCTR.encrypt(aes.utils.utf8.toBytes(connectOps(runner.weightMap)));
    res.end(aes.utils.hex.fromBytes(encryptedBytes));

});

function connectOps(weightMap) {
    return weightMap.map(op => {
        console.info(op.opData);
        return JSON.stringify(op)
    }).join('&');
}

app.listen(3000);
console.log('Server started on port 3000');
