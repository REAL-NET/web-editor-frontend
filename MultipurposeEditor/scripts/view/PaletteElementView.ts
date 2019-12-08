import { NodeType } from "../model/NodeType"

export class PaletteElementView {
    private content: string;
    get Content(): string {
        return this.content;
    }

    private width: number = 50;
    private height: number = 50;

    constructor(name: string, image: string) {
        var node = new NodeType(name, image);
        this.content = 
            `<li>` +
            `   <div class="tree-element"">` +
            `       <img src="${node.Image}" class="element-img" width="${this.width}" height="${this.height}">` +
            `       ${node.Name}` +
            `   </div>` +
            `</li>`;
    }
}