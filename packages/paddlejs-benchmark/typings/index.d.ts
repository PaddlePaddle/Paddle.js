declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare interface TableData {
    name: string;
    t: string;
}

declare interface Row {
    name?: string;
    path?: string;
}

declare interface ModelInfo {
    name?: string;
    modelPath?: string;
}

declare interface Query {
    name?: string;
    count?: number;
    query?: WebGLQuery;
    time?: number;
}
