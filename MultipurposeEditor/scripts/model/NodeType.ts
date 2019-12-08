export class NodeType {
    private name: string;
    get Name(): string {
        return this.name;
    }

    private image: string;
    get Image(): string {
        return this.image;
    }

    constructor(name: string, image: string) {
        this.name = name;
        this.image = image;
    }
}