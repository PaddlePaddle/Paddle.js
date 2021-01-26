// import { JSON } from "./helper/json";
import { mainFunc } from '../../paddlejs-backend-cpu/src/ops/conv2d';

const tensorDataMap = new Map<string, f32[]>();
function opExecutor(weightMapStr: string, fetchTensorName: string): f32[] {
    const jsonObj = JSON.parse(weightMapStr);

    // @ts-ignore
    const opDataList = ((jsonObj as Arr)._arr as Value[]);


    opDataList.forEach((opData, index) => {
        // @ts-ignore
        const opInfo = opData as Obj;
        mainFunc(opInfo, tensorDataMap);
    });

    const result = tensorDataMap.get(fetchTensorName);
    return result;
}

export default opExecutor;