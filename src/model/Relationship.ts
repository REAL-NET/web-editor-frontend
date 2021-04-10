import {Element} from "./Element";
import {ElementInfo} from "./ElementInfo";
import {Slot} from "./Slot";
import {ModelInfo} from "./ModelInfo";

export class Relationship extends Element {
    readonly source: ElementInfo;
    readonly target: ElementInfo;

    constructor(source: ElementInfo, target: ElementInfo,
                name: string, outgoingEdges: ElementInfo[], outgoingAssociations: ElementInfo[],
                incomingEdges: ElementInfo[], directSupertypes: ElementInfo[], slots: Slot,
                model: ModelInfo, hasMetamodel: boolean, metatype: ElementInfo, level: number, potency: number) {
        super(name, outgoingEdges, outgoingAssociations, incomingEdges, directSupertypes,
            slots, model, hasMetamodel, metatype, level, potency);
        this.source = source;
        this.target = target;
    }
}