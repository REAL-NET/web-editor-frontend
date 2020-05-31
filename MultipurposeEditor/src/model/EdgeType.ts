import { NodeType } from "./NodeType";
import { PropertyType } from "./PropertyType";
import { ElementType } from "./ElementType";

export class EdgeType extends ElementType {
    readonly source: NodeType;
    readonly target: NodeType;

    constructor(id: number, name: string,
        shape: string = null, properties: PropertyType[] = null,
        source: NodeType, target: NodeType, )
    {
        super(id, name, shape, properties);
        this.source = source;
        this.target = target;
    }
}
