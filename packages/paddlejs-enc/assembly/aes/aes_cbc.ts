/*
 * @File: AES Lib
 * @Author: stefan
 * @Date: 2020-11-25 21:23:55
 * @LastEditTime: 2020-11-25 21:27:30
 */

import {
    createArray,
    copyArray,
} from './util';
import AES from './aes';

/**
 *  Cipher Block Chaining (CBC)
 */
export default class CBC {

	private lastCipherblock: u8[]
	private aes: AES

    constructor(key: u8[], iv: u8[] | null = null) {
        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }
        this.lastCipherblock = iv.slice(0);
        this.aes = new AES(key);
    }

    encrypt(plaintext: u8[]): u8[] {
        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        let ciphertext = createArray(plaintext.length);
        let block = createArray(16);

        for (let i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (let j = 0; j < 16; j++) {
                block[j] ^= this.lastCipherblock[j];
            }

			this.lastCipherblock = this.aes.encrypt(block);
            copyArray(this.lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    decrypt(ciphertext: u8[]): u8[] {
        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        let plaintext = createArray(ciphertext.length);
        let block = createArray(16);

        for (let i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this.aes.decrypt(block);

            for (let j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this.lastCipherblock[j];
			}

            copyArray(ciphertext, this.lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }
}
