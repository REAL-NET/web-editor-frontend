import {DeepContext} from "./DeepContext";
import {ElementInfo} from "./ElementInfo";
import {Slot} from "./Slot";
import {ModelInfo} from "./ModelInfo";

export class Element extends DeepContext {
    readonly name: string;
    readonly outgoingEdges: ElementInfo[];
    readonly outgoingAssociations: ElementInfo[];
    readonly incomingEdges: ElementInfo[];
    readonly directSupertypes: ElementInfo[];
    readonly slots: Slot;
    readonly model: ModelInfo;
    readonly hasMetamodel: boolean;
    readonly metatype: ElementInfo;

    constructor(name: string, outgoingEdges: ElementInfo[], outgoingAssociations: ElementInfo[],
                incomingEdges: ElementInfo[], directSupertypes: ElementInfo[], slots: Slot,
                model: ModelInfo, hasMetamodel: boolean, metatype: ElementInfo, level: number, potency: number) {
        super(level, potency);
        this.name = name;
        this.outgoingEdges = outgoingEdges;
        this.outgoingAssociations = outgoingAssociations;
        this.incomingEdges = incomingEdges;
        this.directSupertypes = directSupertypes;
        this.slots = slots;
        this.model = model;
        this.hasMetamodel = hasMetamodel;
        this.metatype = metatype;
    }
}