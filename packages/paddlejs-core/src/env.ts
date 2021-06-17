import { getOrMakeGlobalProperty } from './commons/utils';

class Env {
    ENV: object = {};

    set(name, entry) {
        this.ENV[name] = entry;
    }

    get(name) {
        return this.ENV[name];
    }
}

const env = new Env();

export default getOrMakeGlobalProperty('env', env);
