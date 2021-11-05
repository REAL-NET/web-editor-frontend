import {DeepContext} from "./DeepContext";
import {Attribute} from "./Attribute";
import {ElementInfo} from "./ElementInfo";

export class Slot extends DeepContext {
    readonly attribute: Attribute;
    readonly value: ElementInfo;
    readonly isSimple: boolean;
    readonly simpleValue: string;

    constructor(attribute: Attribute, value: ElementInfo, isSimple: boolean, simpleValue: string, level: number, potency: number) {
        super(level, potency)
        this.attribute = attribute;
        this.value = value;
        this.isSimple = isSimple;
        this.simpleValue = simpleValue;
    }
}
