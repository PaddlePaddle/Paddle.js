class Arr extends Array<number> {
    _arr: number[];
    constructor(data?: any) {
        super();

        this._arr = (data && data.map(item => {
            if (item instanceof Object) {
                return new Obj(item);
            }
            return item;
        })) || this;
    }

    // @ts-ignore
    get(string): any;
};
class Obj {
    // @ts-ignore
    data: any;
    constructor(data?: any) {
        this.data = data || {};
    }

    get(str: string): any {
        const value = this.data[str];
        if (Array.isArray(value) || value instanceof Float32Array) {
            return new Arr(this.data[str]);
        }

        else if (value instanceof Object) {
            return new Obj(value);
        }
        return this.data[str];
    }

    // @ts-ignore
    set(str: string, data: any): void {
        this.data[str] = data;
    }
};

class Value {
    // @ts-ignore
    static Bool(val): boolean {
        return Boolean(val);
    }
};

export { Arr, Obj, Value };

