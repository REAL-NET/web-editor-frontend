import {ModelInfo} from "./ModelInfo";
import {ElementInfo} from "./ElementInfo";

export class Model {
    readonly name: string;
    readonly hasMetamodel: boolean;
    readonly metamodel: ModelInfo;
    readonly elements: ElementInfo[];
    readonly nodes: ElementInfo[];
    readonly relationships: ElementInfo[];

    constructor(name: string, hasMetamodel: boolean, metamodel: ModelInfo,
                elements: ElementInfo[], nodes: ElementInfo[], relationships: ElementInfo[]) {
        this.name = name;
        this.hasMetamodel = hasMetamodel;
        this.metamodel = metamodel;
        this.elements = elements;
        this.nodes = nodes;
        this.relationships = relationships;
    }
}