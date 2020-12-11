import { PropertyType } from "./PropertyType";
import { ElementType } from "./ElementType";

export class NodeType extends ElementType {
    public X: any;
    public Y: any;
    constructor(x: any, y: any, id: number, name: string, shape: string = null, properties: PropertyType[] = []) {
        super(id, name, shape, properties);
        this.X = x;
        this.Y = y;
    }
}