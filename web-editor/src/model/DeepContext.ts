export class DeepContext {
    readonly level: number;
    readonly potency: number;

    constructor(level: number, potency: number) {
        this.level = level;
        this.potency = potency;
    }
}