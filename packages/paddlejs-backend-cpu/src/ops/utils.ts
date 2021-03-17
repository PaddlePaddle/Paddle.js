
import { Tensor } from './Tensor';

function getStr(key: string, data: Obj): string {
    const str = data.get(key);
    if (!str) {
        return '';
    }

    const val = str.toString();

    return val.replaceAll ? val.replaceAll('"', '') : val.replace(/"/g, '');
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
function getInt(key: string, data: Obj): i32 {
    const str = data.get(key);
    if (!str) {
        return 0;
    }

    return i32(parseInt(str.toString(), 10));
}

function getBool(key: string, data: Obj): bool {
    const str = data.get(key) as Value;
    // @ts-ignore
    return str.toString() === 'true';
}

function getFloat(key: string, data: Obj): f32 {
    const str = data.get(key);
    if (!str) {
        return 0.0;
    }

    return f32(parseFloat(str.toString()));
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

function getObj(): Obj {
    const obj = new Obj();
    obj.set('name', '');
    obj.set('shape', []);
    obj.set('data', []);
    obj.set('tensorName', '');
    return obj;
}

function getValFromPos(n: i32, c: i32, h: i32, w:i32, tensor: Tensor): f32 {
    const data: f32[] = tensor.data;
    const s = tensor.shapeReduced;
    const count = n * s[0] + c * s[1] + h * s[2] + w;
    return data[count];
}

function getPos(ni: i32, ci: i32, hi: i32, wi: i32, shapeReduced: i32[]): i32 {
    const s = shapeReduced;
    return ni * s[0] + ci * s[1] + hi * s[2] + wi;
}

function reduceShape(shape: i32[]): i32[] {
    if (!shape || shape.length !== 4) {
        return [];
    }
    const c = shape[1];
    const h = shape[2];
    const w = shape[3];
    return [c * h * w, h * w, w];
}


export {
    getIntArray,
    getFloatArray,
    getStr,
    getObj,
    getInt,
    getFloat,
    getPos,
    reduceShape,
    getBool,
    getValFromPos
};