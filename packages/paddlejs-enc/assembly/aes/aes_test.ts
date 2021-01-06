import * as console from "./outConsole";
import CBC from './aes_cbc';
import CTR from './aes_CTR';
import AES from './aes';
import { toBytes, fromBytes, bytes2Hex, hex2Bytes, str2Uint8Array } from './util';

export function initAES(): void {
	let data = 'TextMustBe16Byte';
	const bytes = toBytes(data);
	console.log('AES raw bytes: ' + bytes.toString() + '');
	const key: u8[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	let aes = new AES(key);
	const encryptedBytes = aes.encrypt(bytes);
	console.log('AES encryped bytes: ' + encryptedBytes.toString() + '');

	aes = new AES(key);
	const decryptBytes = aes.decrypt(encryptedBytes);
	console.log('AES decryped bytes: ' + decryptBytes.toString() + '');
}

export function initCTR(): void {
	let data = 'TextMustBe16Byte';
	const bytes = toBytes(data);
	console.log('CTR raw bytes: ' + bytes.toString() + '');
	const key: u8[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	const iv: u8[] = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
	let ctr = new CTR(key, iv);
	const encryptedBytes = ctr.encrypt(bytes);
	console.log('CTR encryped bytes: ' + encryptedBytes.toString() + '');

	ctr = new CTR(key, iv);
	const decryptBytes = ctr.decrypt(encryptedBytes);
	// const str = fromBytes(decryptBytes);
	console.log('CTR decryped bytes: ' + decryptBytes.toString() + '');
}

export function initCBC(): void {
	let data = '我叫樊中恺!';
	const bytes = toBytes(data);
	console.log('CBC raw bytes: ' + bytes.toString() + '');
	const key: u8[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	const iv: u8[] = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
	let cbc = new CBC(key, iv);
	const encryptedBytes = cbc.encrypt(bytes);
	console.log('CBC encryped bytes: ' + encryptedBytes.toString() + '');

	const beforeHex = bytes2Hex(encryptedBytes);
	console.log('Hex: ' + beforeHex);
	const afterHex = hex2Bytes(beforeHex);

	cbc = new CBC(key, iv);
	const decryptBytes = cbc.decrypt(afterHex);
	console.log('CBC decryped bytes: ' + decryptBytes.toString() + '');
	const str = fromBytes(decryptBytes);
	console.log(str);
}
