/**
 * @file graph transformer 抽象类
 */

export default abstract class Transformer {
    name: string; // transformer name

    constructor(name: string) {
        this.name = name;
    }

    abstract transform(...args: any): any;

}
