export default class GraphExecutor {

    constructor(model) {
        this.attrs = model.attrs;
        this.ops  = model.ops;
        this.vars = model.vars;
        // this.constructTensorMap = [];
    }



    get weightMap() {
        return this._weightMap;
    }
}

