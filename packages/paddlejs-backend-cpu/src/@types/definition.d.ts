type i32 = number;
type i64 = number;
type f32 = number;
type f64 = number;
type bool = boolean;
declare function i32(num: number): number;
declare function f32(num: number): number;

declare class Arr extends Array<number> {
    _arr: number[] | Obj[]
}
declare class Obj {
    data: any;
    get(str: string): any
    set(str: string, data: any): void
}
declare class Value extends Obj {
    toString(): string
}
