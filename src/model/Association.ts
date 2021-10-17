import {Relationship} from "./Relationship";
import {ElementInfo} from "./ElementInfo";
import {Slot} from "./Slot";
import {ModelInfo} from "./ModelInfo";

export class Association extends Relationship {
    readonly minSource: number;
    readonly maxSource: number;
    readonly minTarget: number;
    readonly maxTarget: number;

    constructor(minSource: number, maxSource: number, minTarget: number, maxTarget: number,
                source: ElementInfo, target: ElementInfo, type: string,
                name: string, outgoingEdges: ElementInfo[], outgoingAssociations: ElementInfo[],
                incomingEdges: ElementInfo[], directSupertypes: ElementInfo[], slots: Slot,
                model: ModelInfo, hasMetamodel: boolean, metatype: ElementInfo, level: number, potency: number) {
        super(source, target, type, name, outgoingEdges, outgoingAssociations, incomingEdges, directSupertypes,
            slots, model, hasMetamodel, metatype, level, potency);
        this.minSource = minSource;
        this.maxSource = maxSource;
        this.minTarget = minTarget;
        this.maxTarget = maxTarget;
    }
}