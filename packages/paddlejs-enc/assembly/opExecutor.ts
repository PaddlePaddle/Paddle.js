import { JSON } from "./helper/json/index";
import { mainFunc } from './ops/conv2d';

const tensorDataMap = new Map<string, f32[]>();
function opExecutor(weightMapStr: string, fetchTensorName: string): f32[] {
    const jsonObj = JSON.parse(weightMapStr);

    const opDataList = (jsonObj as JSON.Arr)._arr;

    opDataList.forEach((opData, index) => {
        const opInfo = opData as JSON.Obj;
        mainFunc(opInfo, tensorDataMap);
    });

    const result = tensorDataMap.get(fetchTensorName);
    return result;
}

export default opExecutor;