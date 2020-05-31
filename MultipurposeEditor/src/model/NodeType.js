import { ElementType } from "./ElementType";
export class NodeType extends ElementType {
    constructor(x, y, id, name, shape = null, properties = []) {
        super(id, name, shape, properties);
        this.X = x;
        this.Y = y;
    }
}
//# sourceMappingURL=NodeType.js.map