/*
 * @File:
 * @Author: stefan
 * @Date: 2020-11-25 22:08:56
 * @LastEditTime: 2020-11-25 22:08:56
 */
import {
    rcon,
    S, Si,
    T1, T2, T3, T4, T5, T6, T7, T8,
    U1, U2, U3, U4
} from './constants';

import {
    createArray,
	convertToInt32,
} from './util';

export default class AES {

    // decryption round keys
    Kd: i32[][] = [];
    // encryption round keys
    Ke: i32[][] = [];

    constructor(private key: u8[]){
        this.prepare();
	}

    private prepare(): void {

        let rounds = 0;
        switch (this.key.length) {
            // AES-128
            case 16:
                rounds = 10;
                break;
            // AES-192
            case 24:
                rounds = 12;
                break;
            // AES-256
            case 32:
                rounds = 14;
                break;
        }

        if (!rounds) {
            throw new Error('Invalid key length: ' + this.key.length.toString());
        }

        for (let i = 0; i <= rounds; i++) {
            this.Ke.push([0, 0, 0, 0]);
            this.Kd.push([0, 0, 0, 0]);
        }

        let roundKeyCount = (rounds + 1) * 4;
        let KC = this.key.length / 4;

        // convert the key into ints
		let tk: i32[] = convertToInt32(this.key);

        // copy values into round key arrays
        let index: i32;
        for (let i = 0; i < KC; i++) {
            index = i >> 2;
            this.Ke[index][i % 4] = tk[i];
            this.Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        let rconpointer = 0;
        let t = KC;
        let tt: i32;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                (S[(tt >> 8) & 0xFF] << 16) ^
                (S[tt & 0xFF] << 8) ^
                S[(tt >> 24) & 0xFF] ^
                (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (let i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

                // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (let i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[tt & 0xFF] ^
                    (S[(tt >> 8) & 0xFF] << 8) ^
                    (S[(tt >> 16) & 0xFF] << 16) ^
                    (S[(tt >> 24) & 0xFF] << 24));

                for (let i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            let i = 0;
            let r: i32;
            let c: i32;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this.Ke[r][c] = tk[i];
                this.Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (let r = 1; r < rounds; r++) {
            for (let f = 0; f < 4; f++) {
                tt = this.Kd[r][f];
                this.Kd[r][f] = (U1[(tt >> 24) & 0xFF] ^
                    U2[(tt >> 16) & 0xFF] ^
                    U3[(tt >> 8) & 0xFF] ^
                    U4[tt & 0xFF]);
            }
		}
    }

    public encrypt(plaintext: u8[]): u8[] {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        let rounds = this.Ke.length - 1;
        let a: i32[] = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        let t = convertToInt32(plaintext);
        for (let i = 0; i < 4; i++) {
            t[i] ^= this.Ke[0][i];
        }

        // apply round transforms
        for (let r = 1; r < rounds; r++) {
            for (let i = 0; i < 4; i++) {
                a[i] = (T1[(t[i] >> 24) & 0xff] ^
                    T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                    T3[(t[(i + 2) % 4] >> 8) & 0xff] ^
                    T4[t[(i + 3) % 4] & 0xff] ^
                    this.Ke[r][i]);
            }
            t = a.slice(0);
        }

        // the last round is special
        let result = createArray(16);
        let tt: i32;
        for (let i = 0; i < 4; i++) {
            tt = this.Ke[rounds][i];
            result[4 * i] = ((S[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff) as u8;
            result[4 * i + 1] = ((S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff) as u8;
            result[4 * i + 2] = ((S[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff) as u8;
            result[4 * i + 3] = ((S[t[(i + 3) % 4] & 0xff] ^ tt) & 0xff) as u8;
        }

        return result;
    }

    public decrypt(ciphertext: u8[]): u8[] {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        let rounds = this.Kd.length - 1;
        let a: i32[] = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        let t = convertToInt32(ciphertext);
        for (let i = 0; i < 4; i++) {
            t[i] ^= this.Kd[0][i];
        }

        // apply round transforms
        for (let r = 1; r < rounds; r++) {
            for (let i = 0; i < 4; i++) {
                a[i] = (T5[(t[i] >> 24) & 0xff] ^
                    T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                    T7[(t[(i + 2) % 4] >> 8) & 0xff] ^
                    T8[t[(i + 1) % 4] & 0xff] ^
                    this.Kd[r][i]);
            }
            t = a.slice(0);
        }

        // the last round is special
        let result = createArray(16);
        let tt: i32;
        for (let i = 0; i < 4; i++) {
            tt = this.Kd[rounds][i];
            result[4 * i] = ((Si[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff) as u8;
            result[4 * i + 1] = ((Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff) as u8;
            result[4 * i + 2] = ((Si[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff) as u8;
            result[4 * i + 3] = ((Si[t[(i + 1) % 4] & 0xff] ^ tt) & 0xff) as u8;
		}
        return result;
    }

};
