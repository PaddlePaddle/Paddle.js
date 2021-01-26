import {
    Buffer
} from "./util";
import {
    JSONDecoder
} from "./decoder";
class Handler {
    stack: Value[] = new Array < Value > ();

    reset(): void {
        while (this.stack.length > 0) {
            this.stack.pop();
        }
    }

    get peek(): Value {
        return this.stack[this.stack.length - 1];
    }

    setString(name: string, value: string): void {
        const obj: Value = Value.String(value);
        this.addValue(name, obj);
    }

    setBoolean(name: string, value: bool): void {
        const obj = Value.Bool(value);
        this.addValue(name, obj);
    }

    setNull(name: string): void {
        const obj = Value.Null();
        this.addValue(name, obj);
    }

    setInteger(name: string, value: i64): void {
        const obj = Value.Number(value);
        this.addValue(name, obj);
    }

    setFloat(name: string, value: f64): void {
        const obj = Value.FloatNumber(value);
        this.addValue(name, obj);
    }

    pushArray(name: string): bool {
        const obj: Value = Value.Array();
        if (this.stack.length == 0) {
            this.stack.push(obj);
        } else {
            this.addValue(name, obj)
            this.stack.push(obj);
        }
        return true;
    }

    popArray(): void {
        if (this.stack.length > 1) {
            this.stack.pop();
        }
    }

    pushObject(name: string): bool {
        const obj: Value = Value.Object();
        this.addValue(name, obj);
        this.stack.push(obj);
        return true;
    }

    popObject(): void {
        if (this.stack.length > 1) {
            this.stack.pop();
        }
    }

    addValue(name: string, obj: Value): void {
        if (name.length == 0 && this.stack.length == 0) {
            this.stack.push(obj);
            return;
        }
        if (this.peek instanceof Obj) {
            (this.peek as Obj).set(name, obj);
        } else if (this.peek instanceof Arr) {
            ( < Arr > this.peek).push(obj);
        }
    }
}

namespace _JSON {
    @lazy
    export const handler: Handler = new Handler();
    @lazy
    export const decoder: JSONDecoder < Handler > = new JSONDecoder < Handler > (_JSON.handler);

    /** Parses a string or Uint8Array and returns a Json Value. */
    export function parse < T = Uint8Array > (str: T): Value {
        var arr: Uint8Array;
        if (isString < T > (str)) {
            arr = Buffer.fromString( < string > str);
        } else {
            arr = changetype < Uint8Array > (str);
        }
        this.decoder.deserialize(arr);
        const res = this.decoder.handler.peek;
        this.decoder.handler.reset();
        return res;
    }
}

//@ts-ignore

@global
export abstract class Value {
    static String(str: string): Str {
        return new Str(str);
    }
    static Number(num: i64): Num {
        return new Num(num);
    }
    static FloatNumber(num: f64): FloatNum {
        return new FloatNum(num);
    }
    static Bool(b: bool): Bool {
        return new Bool(b);
    }
    static Null(): Null {
        return new Null();
    }
    static Array(): Arr {
        return new Arr();
    }
    static Object(): Obj {
        return new Obj();
    }

    toString(): string {
        if (this instanceof Str) {
            return ( < Str > this).toString();
        }
        if (this instanceof Num) {
            return ( < Num > this).toString();
        }
        if (this instanceof Bool) {
            return ( < Bool > this).toString();
        }
        if (this instanceof Null) {
            return ( < Null > this).toString();
        }
        if (this instanceof Arr) {
            return ( < Arr > this).toString();
        }
        if (this instanceof Obj) {
            return ( < Obj > this).toString();
        }
        throw new Error("Not a value.");
    }
}

export class Str extends Value {
    constructor(public _str: string) {
        super();
    }

    toString(): string {
        return "\"" + this._str + "\"";
    }
}

export class Num extends Value {
    constructor(public _num: i64) {
        super();
    }

    toString(): string {
        return this._num.toString();
    }
}

export class FloatNum extends Value {
    constructor(public _num: f64) {
        super();
    }

    toString(): string {
        return this._num.toString();
    }
}

export class Null extends Value {
    constructor() {
        super();
    }

    toString(): string {
        return "null";
    }
}

export class Bool extends Value {
    constructor(public _bool: bool) {
        super();
    }

    toString(): string {
        return this._bool.toString();
    }
}

@global
export class Arr extends Value {
    _arr: Array < Value > ;
    constructor() {
        super();
        this._arr = new Array < Value > ();
    }

    push(obj: Value): void {
        this._arr.push(obj);
    }

    toString(): string {
        return "[" + this._arr.map < string > ((val: Value, i: i32, _arr: Value[]): string => val.toString()).join(",") + "]";
    }
}

@global
export class Obj extends Value {
    _obj: Map < string,
    Value > ;
    keys: Array < string > ;

    constructor() {
        super();
        this._obj = new Map();
        this.keys = new Array();
    }

    set < T > (key: string, value: T): void {
        if (isReference < T > (value)) {
            if (value instanceof Value) {
                this._set(key, < Value > value);
                return;
            }
        }
        this._set(key, from < T > (value));

    }
    private _set(key: string, value: Value): void {
        if (!this._obj.has(key)) {
            this.keys.push(key);
        }
        this._obj.set(key, value);
    }

    get(key: string): Value | null {
        if (!this._obj.has(key)) {
            return null;
        }
        return this._obj.get(key);
    }

    toString(): string {
        const objs: string[] = [];
        for (let i: i32 = 0; i < this.keys.length; i++) {
            objs.push("\"" + this.keys[i] + "\":" + this._obj.get(this.keys[i]).toString());
        }
        return "{" + objs.join(",") + "}";
    }

    has(key: string): bool {
        return this._obj.has(key);
    }
}


export function from < T > (val: T): Value {
    if (isBoolean < T > (val)) {
        return Value.Bool( < bool > val);
    }
    if (isInteger < T > (val)) {
        return Value.Number(val);
    }
    if (isString < T > (val)) {
        return Value.String( < string > val);
    }
    if (val == null) {
        return Value.Null();
    }
    if (isArrayLike < T > (val)) {
        const arr = Value.Array();
        for (let i: i32 = 0; i < val.length; i++) {
            //@ts-ignore
            arr.push(from < valueof < T >> (val[i]));
        }
        return arr;
    }
    /**
     * TODO: add object support.
     */
    return Value.Object();
}

@global
export namespace JSON {
    //@ts-ignore
    @inline
    /** Parses a string or Uint8Array and returns a Json Value. */
    export function parse < T = Uint8Array > (str: T): Value {
        return _JSON.parse(str);
    }
}
