export default class Env {
    private static ENV: object;
    static set(name, entry) {
        if (!Env.ENV) {
            Env.ENV = new Env();
        }
        Env.ENV[name] = entry;
    }

    static get(name) {
        if (!Env.ENV) {
            Env.ENV = new Env();
        }
        return Env.ENV[name];
    }
}

