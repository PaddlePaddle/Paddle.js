function getStr(key: string, data: Obj): string {
    const str = data.get(key);
    if (!str) {
        return '';
    }

    const val = str.toString();

    return val.replaceAll ? val.replaceAll('"', '') : val.replace(`/"/g`, '');
}
function getIntArray(key: string, data: Obj): i32[] {
    const tensorDataVal = data.get(key);
    if (!tensorDataVal) {
        return [];
    }

    const tensorData = tensorDataVal as Arr;

    const arr = tensorData._arr as Value[];

    // @ts-ignore
    return arr.map(function (item: Value, index: i32, array: Value[]): i32 {
        return i32(parseInt(item.toString(), 10));
    });
}

function getFloatArray(key: string, data: Obj): f32[] {
    const tensorDataVal = data.get(key);
    if (!tensorDataVal) {
        return [];
    }

    const tensorData = tensorDataVal as Arr;

    if (!tensorData._arr || !tensorData._arr.length) {
        return [];
    }

    const arr = tensorData._arr as Value[];
    // @ts-ignore
    return arr.map(function (item: Value, index: i32, array: Value[]): f32 {
        return f32(parseFloat(item.toString()));
    });
}

export {
    getIntArray,
    getFloatArray,
    getStr
}