import { Buffer } from './util/index';

export class JSONEncoder {
    private _isFirstKey: i32[];
    private result: string[];

    constructor() {
        this._isFirstKey = new Array<i32>(10);
        this.result = new Array<string>();
        this._isFirstKey.push(1);
    }

    get isFirstKey(): bool {
        return <bool>this._isFirstKey[this._isFirstKey.length - 1];
    }

    serialize(): Uint8Array {
        // TODO: Write directly to UTF8 bytes
        return Buffer.fromString(this.toString());
    }

    toString(): string {
        return this.result.join("");
    }

    setString(name: string | null, value: string): void {
        this.writeKey(name);
        this.writeString(value);
    }

    setBoolean(name: string | null, value: bool): void {
        this.writeKey(name);
        this.writeBoolean(value);
    }

    setNull(name: string | null): void {
        this.writeKey(name);
        this.write("null");
    }

    setInteger(name: string | null, value: i64): void {
        this.writeKey(name);
        this.writeInteger(value);
    }

    pushArray(name: string | null): bool {
        this.writeKey(name);
        this.write("[");
        this._isFirstKey.push(1);
        return true;
    }

    popArray(): void {
        this.write("]");
        this._isFirstKey.pop();
    }

    pushObject(name: string | null): bool {
        this.writeKey(name);
        this.write("{");
        this._isFirstKey.push(1);
        return true;
    }

    popObject(): void {
        this.write("}");
        this._isFirstKey.pop();
    }

    private writeKey(str: string | null): void {
        if (!this.isFirstKey) {
            this.write(",");
        } else {
            this._isFirstKey[this._isFirstKey.length - 1] = 0;
        }
        if (str != null && (<string>str).length > 0) {
            this.writeString(str!);
            this.write(":");
        }
    }

    private writeString(str: string): void {
        this.write('"');
        let savedIndex = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            let needsEscaping = char < 0x20 || char == '"'.charCodeAt(0) || char == '\\'.charCodeAt(0);
            if (needsEscaping) {
                this.write(str.substring(savedIndex, i));
                savedIndex = i + 1;
                if (char == '"'.charCodeAt(0)) {
                    this.write('\\"');
                } else if (char == "\\".charCodeAt(0)) {
                    this.write("\\\\");
                } else if (char == "\b".charCodeAt(0)) {
                    this.write("\\b");
                } else if (char == "\n".charCodeAt(0)) {
                    this.write("\\n");
                } else if (char == "\r".charCodeAt(0)) {
                    this.write("\\r");
                } else if (char == "\t".charCodeAt(0)) {
                    this.write("\\t");
                } else {
                    // TODO: Implement encoding for other contol characters
                    //@ts-ignore integer does have toString
                    assert(false, "Unsupported control character code: " + char.toString());
                }
            }
        }
        this.write(str.substring(savedIndex, str.length));
        this.write('"');
    }

    private writeBoolean(value: bool): void {
        this.write(value ? "true" : "false");
    }

    private writeInteger(value: i64): void {
        //@ts-ignore integer does have toString
        this.write(value.toString());
    }

    private write(str: string): void {
        this.result.push(str);
    }
}
