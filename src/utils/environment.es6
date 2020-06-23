export default class Enviroment {
    constructor() {
        this.ENV = {};
    }
    static setEntry(name, entry) {
        this.ENV[name] = entry;
    }

    static env() {
        if (!this.ENV) {
            this.ENV = new Enviroment();
        }
        return this.ENV;
    }
}