/*
 * @File: PKCS7 Padding, https://tools.ietf.org/html/rfc2315
 * @Author: stefan
 * @Date: 2020-11-25 21:29:03
 * @LastEditTime: 2020-11-25 21:30:15
 */

import { createArray, copyArray } from './util'

export function pad(data: u8[]): u8[] {
    let padder = 16 - (data.length % 16);
    let result = createArray(data.length + padder);
    copyArray(data, result);
    for (let i = data.length; i < result.length; i++) {
        result[i] = padder;
    }
    return result;
}

export function strip(data: u8[]): u8[] {
    if (data.length < 16) { throw new Error('PKCS #7 invalid length'); }

    let padder = data[data.length - 1];
    if (padder > 16) { throw new Error('PKCS #7 padding byte out of range'); }

    let length = data.length - padder;
    for (let i = 0; i < padder; i++) {
        if (data[length + i] !== padder) {
            throw new Error('PKCS#7 invalid padding byte');
        }
    }

    let result = createArray(length);
    copyArray(data, result, 0, 0, length);
    return result;
}
