import { ElementType } from "./ElementType";
export class EdgeType extends ElementType {
    constructor(id, name, shape = null, properties = null, source, target) {
        super(id, name, shape, properties);
        this.source = source;
        this.target = target;
    }
}
//# sourceMappingURL=EdgeType.js.map