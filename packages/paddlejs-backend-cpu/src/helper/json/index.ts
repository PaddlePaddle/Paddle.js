// export * from "./decoder";
// export * from "./encoder";
// export * from "./JSON";

// export const JSON = {
//     Value: typeof Object,
//     Arr: typeof Array,
//     Obj: typeof Object,
// }

// JSON.prototype.Value = class {};

// export JSON;
class Value extends Object {};
class Arr extends Array {};
class Obj extends Object {};


namespace JSON {
    export interface Value extends Object {};

    export interface Arr extends Array<Number> {
        get(string): any,
        _arr: any
    };
    export class Obj extends Object {
        constructor() {
            super();
        }
        get(str: string): any {}
        set(str: string, data: any) {}
    };

    // export type Obj = typeof Object;
    // export class Arr extends Array {};
    // export class Obj extends Object {};
}

export { JSON };

// export class JSON {
//     static Value
//     static Arr
//     static Obj
// };
