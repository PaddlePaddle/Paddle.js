/*
 * @File: AES Lib
 * @Author: stefan
 * @Date: 2020-11-25 21:23:55
 * @LastEditTime: 2020-11-25 21:27:30
 */

import AES from './aes';
import {
    createArray,
    copyArray,
} from './util';


/**
 *  Counter (CTR)
 */
export default class ModeOfOperationCTR {

	private remainingCounter: u8[];
	private remainingCounterIndex: u32;
	private aes: AES;
	private counter: Counter;

    constructor(key: u8[], cnt: u8[]) {
        this.counter = new Counter(cnt)
        this.remainingCounter = [];
        this.remainingCounterIndex = 16;
        this.aes = new AES(key);
    }

    //对称加解密
    encrypt(plaintext: u8[]): u8[] {
        var encrypted = plaintext.slice(0);

        for (var i = 0; i < encrypted.length; i++) {
            if (this.remainingCounterIndex === 16) {
                this.remainingCounter = this.aes.encrypt(this.counter.counter);
                this.remainingCounterIndex = 0;
                this.counter.increment();
            }
            encrypted[i] ^= this.remainingCounter[this.remainingCounterIndex++];
        }

        return encrypted;
    }

    decrypt(plaintext: u8[]): u8[] {
        var encrypted = plaintext.slice(0);

        for (var i = 0; i < encrypted.length; i++) {
            if (this.remainingCounterIndex === 16) {
                this.remainingCounter = this.aes.encrypt(this.counter.counter);
                this.remainingCounterIndex = 0;
                this.counter.increment();
            }
            encrypted[i] ^= this.remainingCounter[this.remainingCounterIndex++];
        }

        return encrypted;
    }
}

/**
*  Counter object for CTR common mode of operation
*/
class Counter {

    counter: u8[] = createArray(16);

    constructor(initialValue: u8[]) {
        this.setBytes(initialValue);
    }

    setBytes(bytes: u8[]): void {
        bytes = bytes.slice(0);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this.counter = bytes;
    }

    increment(): void {
        for (var i = 15; i >= 0; i--) {
            if (this.counter[i] === 255) {
                this.counter[i] = 0;
            } else {
                this.counter[i]++;
                break;
            }
        }
    }
};
