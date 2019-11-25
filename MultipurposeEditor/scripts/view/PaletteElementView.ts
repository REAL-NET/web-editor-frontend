export class PaletteElementView {
    readonly content: string;
    private width: number;
    private height: number;

    constructor(name: string, elementClass: string, type: string, imageSource: string) {
        this.content = 
            `<li>` +
            `   <div class="${elementClass}" type="${type}">` +
            `       <img src="${imageSource}" width="${this.width}" height="${this.height}">` +
            `       ${name}` +
            `   </div>` +
            `</li>`;
    }
}