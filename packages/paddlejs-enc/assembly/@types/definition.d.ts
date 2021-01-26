declare namespace JSON {
    function parse < T = Uint8Array > (str: T): Value
}
declare class Obj {
    data: any;
    get(str: string): any
}
declare class Arr extends Array<number> {
    _arr: number[] | Obj[]
}

declare class Value extends Obj {
    toString(): string
}
