export declare global {
    type i32 = number;
    type i64 = number;
    type f32 = number;
    type f64 = number;
    type bool = boolean;
    function i32(string): number;
    function f32(string): number;
    class Arr extends Array<number> {
        _arr: number[] | Obj[]
    }
    class Obj {
        data: any;
        get(str: string): any
        set(str: string, data: any): void
    }
    class Value extends Obj {
        toString(): string
    }
}