/*
 * @File: AES Lib
 * @Author: stefan
 * @Date: 2020-11-25 21:23:55
 * @LastEditTime: 2020-11-25 21:27:30
 */

import * as console from "./helper/outConsole";
import CTR from './aes/aes_CTR';
import { toBytes, fromBytes, hex2Bytes } from './aes/util';
import OpExecutor from './op_executor';

import { Conv2dAttrs } from './ops/conv2d_interface';

export function loadModel(hex: string): void {

    const bytes = hex2Bytes(hex);
    const key: u8[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    const iv: u8[] = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
    const ctr = new CTR(key, iv);
    const decryptBytes = ctr.decrypt(bytes);
    const str = fromBytes(decryptBytes);
    const opMap: string[] = str.split('&');

    const conv2dSource = opMap[1];

    console.log(conv2dSource);

    const od = new OpExecutor<Conv2dAttrs>(new Conv2dAttrs(), toBytes(conv2dSource));

    //run program here

}
