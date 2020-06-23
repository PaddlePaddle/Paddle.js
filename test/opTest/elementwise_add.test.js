import Graph from '../../src/graph/graph';
import GraphExecutor from '../../src/executor/executor';
import opInfo from '../../test/data/model.test.elementwise_add.json';
import Utils from '../../src/utils/utils';
import {webgl} from './common';
import {nchwShape2nhwcShape, getOutputShape, deepCopy} from './common/utils';

const modelType = 'elementwise_add';
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
    const expectd = [-1.1135177612304688, 6.288958549499512, 3.139874219894409, 1.9048583507537842, 0.03913835436105728, 2.6481428146362305, 2.8079400062561035, 2.1263062953948975, -0.6012501120567322, -4.3257622718811035, 12, 13];
    expect(JSON.stringify(formatData)).toBe(JSON.stringify(expectd));

}

test('test op elementwise_add ==============>', async () => {
    await run();
});
