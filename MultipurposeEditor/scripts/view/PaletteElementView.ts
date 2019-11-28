export class PaletteElementView {
    readonly content: string;
    private width: number;
    private height: number;

    constructor(name: string, type: string, imageSource: string) {
        this.content = 
            `<li>` +
            `   <div class="tree-element" type="${type}">` +
            `       <img src="${imageSource}" class="element-img" width="${this.width}" height="${this.height}">` +
            `       ${name}` +
            `   </div>` +
            `</li>`;
    }
}