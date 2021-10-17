import {DeepContext} from "./DeepContext";
import {Attribute} from "./Attribute";
import {ElementInfo} from "./ElementInfo";

export class Slot extends DeepContext {
    readonly attribute: Attribute;
    readonly value: ElementInfo;

    constructor(attribute: Attribute, value: ElementInfo, level: number, potency: number) {
        super(level, potency)
        this.attribute = attribute;
        this.value = value;
    }
}