import { NodeType } from "../model/NodeType";
export class PaletteElementView {
    constructor(name, image) {
        this.width = 50;
        this.height = 50;
        var node = new NodeType(name, image);
        this.content =
            `<li>` +
                `   <div class="tree-element"">` +
                `       <img src="${node.Image}" class="element-img" width="${this.width}" height="${this.height}">` +
                `       ${node.Name}` +
                `   </div>` +
                `</li>`;
    }
    get Content() {
        return this.content;
    }
}
//# sourceMappingURL=PaletteElementView.js.map