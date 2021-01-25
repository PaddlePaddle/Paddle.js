import { JSON } from '../helper/json/JSON';

function getStr(key: string, data: JSON.Obj): string {
    const str = data.get(key);
    return str ? str.toString().replaceAll('"', '') : '';
}
function getIntArray(key: string, data: JSON.Obj): i32[] {
    const tensorData = data.get(key) as JSON.Arr;
    if (!tensorData) {
        return [];
    }

    const arr = tensorData._arr as JSON.Value[];
    return arr.map(function (item: JSON.Value, index: i32, array: JSON.Value[]): i32 {
        return i32(parseInt(item.toString(), 10));
    });
}

function getFloatArray(key: string, data: JSON.Obj): f32[] {
    const tensorData = data.get(key) as JSON.Arr;
    if (!tensorData) {
        return [];
    }

    const arr = tensorData._arr as JSON.Value[];
    return arr.map(function (item: JSON.Value, index: i32, array: JSON.Value[]): f32 {
        return f32(parseFloat(item.toString()));
    });
}

export {
    getIntArray,
    getFloatArray,
    getStr
}