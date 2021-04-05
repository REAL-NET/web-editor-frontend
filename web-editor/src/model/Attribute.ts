import {DeepContext} from "./DeepContext";
import {ElementInfo} from "./ElementInfo";

export class Attribute extends DeepContext {
    readonly name: string;
    readonly type: ElementInfo;

    constructor(name: string, type: ElementInfo, level: number, potency: number) {
        super(level, potency);
        this.name = name;
        this.type = type;
    }
}