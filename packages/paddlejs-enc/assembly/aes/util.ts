/*
 * @File: Utilities
 * @Author: stefan
 * @Date: 2020-11-25 21:26:43
 * @LastEditTime: 2020-11-25 21:27:22
 */
import { Hex } from './constants';

export function createArray(length: i32): u8[] {
    let ret: u8[] = [];
    ret.length = length;
    ret.fill(0, 0);
    return ret;
}

export function copyArray<T>(sourceArray: T[], targetArray: T[], targetStart: i32 = 0, sourceStart: i32 = 0, sourceEnd: i32 = 0): void {
    if (sourceEnd) {
        sourceArray = sourceArray.slice(sourceStart, sourceEnd);
    }
    else {
        sourceArray = sourceArray.slice(sourceStart);
    }
    while (sourceArray.length) {
        targetArray[targetStart++] = sourceArray.shift();
    }
}

export function convertToInt32(bytes: u8[]): i32[] {
    let result: i32[] = [];
    for (let i = 0; i < bytes.length; i += 4) {
		const b0 = bytes[i] as i32;
		const b1 = bytes[i + 1] as i32;
		const b2 = bytes[i + 2] as i32;
		const b3 = bytes[i + 3] as i32;
        result[i / 4] = (b0 << 24) |
            (b1 << 16) |
            (b2 << 8) |
            b3
    }
    return result;
}


// 参考closure
// https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
// 忽略Surrogate Pair
export function toBytes(str: string): u8[] {
    let out: u8[] = [], p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c as u8;
        } else if (c < 2048) {
            out[p++] = ((c >> 6) | 192) as u8;
            out[p++] = ((c & 63) | 128) as u8;
        } else {
            out[p++] = ((c >> 12) | 224) as u8;
            out[p++] = (((c >> 6) & 63) | 128) as u8;
            out[p++] = ((c & 63) | 128) as u8;
        }
    }
    return out;
}

// not fo CJK
export function str2Uint8Array(str: string): Uint8Array {
    let arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

// 参考closure
// https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L151
// 忽略Surrogate Pair
export function fromBytes(bytes: u8[]): string {
    let out: i32[] = [], pos = 0, c = 0;
    while (pos < bytes.length) {
        let c1 = bytes[pos++] as i32;
        if (c1 < 128) {
            out.push(c1);
        } else if (c1 > 191 && c1 < 224) {
            let c2 = bytes[pos++] as i32;
            let u = (c1 & 31) << 6 | c2 & 63;
            out.push(u);
        } else {
            let c2 = bytes[pos++] as i32;
            let c3 = bytes[pos++] as i32;
            let u = (c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63;
            out.push(u);
        }
    }
    return out.reduce((prev, cur: i32) => prev + String.fromCharCode(cur), '');
}

export function hex2Bytes(text: string): u8[] {
	let result: u8[] = [];
	for (let i = 0; i < text.length; i += 2) {
		result.push(parseInt(text.substr(i, 2), 16) as u8);
	}
	return result;
}

export function bytes2Hex(bytes: u8[]): string {
	let result: string[] = [];
	for (let i = 0; i < bytes.length; i++) {
		let v = bytes[i];
		const hIndex = (v & 0xf0) >> 4;
		const lIndex = v & 0x0f;
		result.push(Hex[hIndex] + Hex[lIndex]);
	}
	return result.join('');
}

export namespace Buffer {
    export function fromString(str: string): Uint8Array {
        const buffer = String.UTF8.encode(str, false);

        // Workaround for https://github.com/AssemblyScript/assemblyscript/issues/1066
        if (buffer.byteLength === 0) return new Uint8Array(0);

        return Uint8Array.wrap(buffer);
    }

    export function toString(arr: Uint8Array): string {
        return String.UTF8.decode(arr.buffer, false);
    }

    /**
     * Returns a pointer to the start of the raw data (i.e. after the header)
     *
     * @see https://docs.assemblyscript.org/details/memory#internals
     */
    export function getDataPtr(arr: Uint8Array): usize {
        return changetype<usize>(arr.buffer) + arr.byteOffset;
    }

    export function readString(arr: Uint8Array, start: usize, end: usize): string {
        return String.UTF8.decodeUnsafe(getDataPtr(arr) + start, end - start);
    }
}

