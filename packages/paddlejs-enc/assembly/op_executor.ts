import { fromBytes } from "./aes/util";
import * as console from "./helper/outConsole";


const TRUE_STR = "true";
const FALSE_STR = "false";
const NULL_STR = "null";
const CHAR_0: i32 = 48; //"0".charCodeAt(0);
const CHAR_9: i32 = 57; //"9".charCodeAt(0);
const CHAR_A: i32 = 65; //"A".charCodeAt(0);
const CHAR_A_LOWER: i32 = 97; //"a".charCodeAt(0);
const CHAR_POINT: i32 = 46; //".".charCodeAt(0);
const CHAR_LEFT_PARENTHESE: i32 = 123; //"{".charCodeAt(0);
const CHAR_RIGHT_PARENTHESE: i32 = 125; //"}".charCodeAt(0);
const CHAR_LEFT_BRACKET: i32 = 91; //"[".charCodeAt(0);
const CHAR_RIGHT_BRACKET: i32 = 93; //"]".charCodeAt(0);
const CHAR_COLON: i32 = 58; //":".charCodeAt(0);
const CHAR_COMMA: i32 = 44; //",".charCodeAt(0);
const CHAR_QUOT: i32 = 34; //'"'.charCodeAt(0);

export default class OpExecutor<T> {

    private readIndex: i32;
    private lastKey: string;
    private id: string;
    private type: string;

    constructor(private attrs: T, private source: u8[]) {
        this.readIndex = 0;
        this.lastKey = '';
        this.id = '';
        this.type = '';
        this.parseOp();
    }

    private parseOp(): boolean {
        if (this.peekChar() != CHAR_LEFT_PARENTHESE) {
            return false;
        }
        let key = this.lastKey;
        //@ts-ignore can be null
        this.lastKey = '';
        this.readChar();
        this.skipWhitespace();

        let firstItem = true;
        while (this.peekChar() != CHAR_RIGHT_PARENTHESE) {
            if (!firstItem) {
                assert(this.readChar() == CHAR_COMMA, "Expected ','");
            } else {
                firstItem = false;
            }
            this.parseKey();
            console.log(this.lastKey + ' ===')
            this.parseOpValue();
        }
        assert(this.readChar() == CHAR_RIGHT_PARENTHESE, "Unexpected end of object");
        return true;
    }

    private parseOpValue(): void {
        this.skipWhitespace();
        if(this.lastKey == 'id') {
            this.id = this.parseString();
        }
        if(this.lastKey == 'type') {
            this.type = this.parseString();
        }
        this.skipWhitespace();
    }

    private parseValue(): bool {
        this.skipWhitespace();
        let result = this.parseObject()
            || this.parseArray<i32>()
            || this.parseString()
            || this.parseBoolean()
            || this.parseNumber()
            || this.parseNull()
        this.skipWhitespace();
        return result;
    }

    private peekChar(): i32 {
        if (this.readIndex >= this.source.length) {
            return -1;
        }
        return this.source[this.readIndex];
    }

    private readChar(): i32 {
        assert(this.readIndex < this.source.length, "Unexpected input end");
        return this.source[this.readIndex++];
    }

    private getString(start: u32, end: u32 = this.readIndex): string {
        return fromBytes(this.source.slice(start, end - 1));
	}

    private parseObject(): bool {
        if (this.peekChar() != CHAR_LEFT_PARENTHESE) {
            return false;
        }
        let key = this.lastKey;
        //@ts-ignore can be null
        this.lastKey = '';
        this.readChar();
        this.skipWhitespace();

        let firstItem = true;
        while (this.peekChar() != CHAR_RIGHT_PARENTHESE) {
            if (!firstItem) {
                assert(this.readChar() == CHAR_COMMA, "Expected ','");
            } else {
                firstItem = false;
            }
            this.parseKey();
            this.parseValue();
        }
        assert(this.readChar() == CHAR_RIGHT_PARENTHESE, "Unexpected end of object");
        return true;
    }

    private parseKey(): void {
        this.skipWhitespace();
        this.lastKey = this.readString();
        this.skipWhitespace();
        assert(this.readChar() == CHAR_COLON, "Expected ':'");
    }

    private parseArray<D>(): D[] | null {
        if (this.peekChar() != CHAR_LEFT_BRACKET) {
            return null;
        }
        let data: D[] = [];
        //@ts-ignore can be null
        this.lastKey = '';
        this.readChar();
        this.skipWhitespace();

        let firstItem = true;
        while (this.peekChar() != CHAR_RIGHT_BRACKET) {
            if (!firstItem) {
                assert(this.readChar() == CHAR_COMMA, "Expected ','");
            } else {
                firstItem = false;
            }
            data.push(this.parseValue() as D);
        }
        assert(this.readChar() == CHAR_RIGHT_BRACKET, "Unexpected end of array");
        return data;
    }

    private parseString(): string {
        if (this.peekChar() != CHAR_QUOT) {
            return '';
        }
        return this.readString();
    }

    private readString(): string {
        assert(this.readChar() == CHAR_QUOT, "Expected double-quoted string");
        let savedIndex = this.readIndex;
        //@ts-ignore can be null
        let stringParts: Array<string> = new Array<string>();
        for (; ;) {
            let byte = this.readChar();
            assert(byte >= 0x20, "Unexpected control character");
            if (byte == CHAR_QUOT) {
                let s = this.getString(savedIndex);
                if (stringParts.length == 0) {
                    return s;
                }
                stringParts.push(s);
                return stringParts.join('');
            } else if (byte == "\\".charCodeAt(0)) {
                if (this.readIndex > savedIndex + 1) {
                    stringParts.push(this.getString(savedIndex));
                }
                stringParts.push(this.readEscapedChar());
                savedIndex = this.readIndex;
            }
        }
        // Should never happen
        return '';
    }

    private readEscapedChar(): string {
        let byte = this.readChar();
        // TODO: Use lookup table for anything except \u
        if (byte == CHAR_QUOT) {
            return '"';
        }
        if (byte == "\\".charCodeAt(0)) {
            return "\\";
        }
        if (byte == "/".charCodeAt(0)) {
            return "/";
        }
        if (byte == "b".charCodeAt(0)) {
            return "\b";
        }
        if (byte == "n".charCodeAt(0)) {
            return "\n";
        }
        if (byte == "r".charCodeAt(0)) {
            return "\r";
        }
        if (byte == "t".charCodeAt(0)) {
            return "\t";
        }
        if (byte == "u".charCodeAt(0)) {
            let d1 = this.readHexDigit();
            let d2 = this.readHexDigit();
            let d3 = this.readHexDigit();
            let d4 = this.readHexDigit();
            let charCode = d1 * 0x1000 + d2 * 0x100 + d3 * 0x10 + d4;
            return String.fromCodePoint(charCode);
        }
        assert(false, "Unexpected escaped character: " + String.fromCharCode(byte));
        return '';
    }

    private readHexDigit(): i32 {
        let byte = this.readChar();
        let digit = byte - CHAR_0;
        if (digit > 9) {
            digit = byte - CHAR_A + 10;
            if (digit < 10 || digit > 15) {
                digit = byte - CHAR_A_LOWER + 10;
            }
        }
        let arr: Array<i32> = [byte, digit];
        assert(digit >= 0 && digit < 16, "Unexpected \\u digit");
        return digit;
    }

    // support float
    private parseNumber(): bool {
        let number: i64 = 0;
        let sign: i64 = 1;
        if (this.peekChar() == "-".charCodeAt(0)) {
            sign = -1;
            this.readChar();
        }
        let digits = 0;
        let inFloatParse = false;
        let decimalLen = 0;
        while (CHAR_0 <= this.peekChar() && this.peekChar() <= CHAR_9 || this.peekChar() == CHAR_POINT) {
            if (this.peekChar() == CHAR_POINT) {
                inFloatParse = true;
            }
            let byte = this.readChar();
            if(inFloatParse) {
                number += (byte - CHAR_0) / ++decimalLen * 10;
            }
            else {
                number *= 10;
                number += byte - CHAR_0;
                digits++;
            }

        }
        if (digits > 0) {
            return true;
        }
        return false;
    }

    private parseBoolean(): bool {
        if (this.peekChar() == FALSE_STR.charCodeAt(0)) {
            this.readAndAssert(FALSE_STR);
            return true;
        }
        if (this.peekChar() == TRUE_STR.charCodeAt(0)) {
            this.readAndAssert(TRUE_STR);
            return true;
        }

        return false;
    }

    private parseNull(): bool {
        if (this.peekChar() == NULL_STR.charCodeAt(0)) {
            this.readAndAssert(NULL_STR);
            return true;
        }
        return false;
    }

    private readAndAssert(str: string): void {
        for (let i = 0; i < str.length; i++) {
            assert(str.charCodeAt(i) == this.readChar(), "Expected '" + str + "'");
        }
    }

    private skipWhitespace(): void {
        while (this.isWhitespace(this.peekChar())) {
            this.readChar();
        }
    }

    private isWhitespace(charCode: i32): bool {
        return charCode == 0x9 || charCode == 0xa || charCode == 0xd || charCode == 0x20;
    }
}
