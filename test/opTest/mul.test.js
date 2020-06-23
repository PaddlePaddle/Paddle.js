import Graph from '../../src/graph/graph';
import GraphExecutor from '../../src/executor/executor';
import opInfo from '../../test/data/model.test.mul.json';
import Utils from '../../src/utils/utils';
import {webgl} from './common';
import {nchwShape2nhwcShape, getOutputShape, deepCopy} from './common/utils';

const modelType= 'mul';
const output = deepCopy(opInfo);

const op = opInfo.ops[0];
const graphExecutor = new GraphExecutor(op);
const graph = new Graph({
    options: {
        test: true,
        gl: webgl
    }
});
graph.data = opInfo;
graph.buildOpData(graphExecutor);

async function run() {
    graph.execute_(graphExecutor);
    let result = await graph.inst.read();
    // 获取 NHWC -> NCHW 的 输出
    const outputNCHWShape = getOutputShape(output, modelType);
    const outputNHWCShape = nchwShape2nhwcShape(outputNCHWShape);

    let nchwResult = Utils.nhwc2nchw(result, outputNHWCShape);
    const formatData = Utils.formatReadData(nchwResult, outputNCHWShape);
    const expectd = [9, -2, -1, 9, 9, 11];
    expect(JSON.stringify(formatData)).toBe(JSON.stringify(expectd));

}

test('test op mul ==============>', async () => {
    await run();
});
