import {ModelInfo} from "./ModelInfo";

export class ElementInfo {
    readonly name: string;
    readonly model: ModelInfo;

    constructor(name: string, model: ModelInfo) {
        this.model = model;
        this.name = name;
    }
}