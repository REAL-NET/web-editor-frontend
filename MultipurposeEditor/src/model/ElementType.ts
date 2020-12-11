import { PropertyType } from "./PropertyType";

export class ElementType {
    public id: number;
    readonly name: string;
    readonly shape: string;
    readonly properties: PropertyType[];

    constructor(id: number, name: string, shape: string = null, properties: PropertyType[] = []) {
        this.id = id;
        this.name = name;
        this.shape = shape;
        this.properties = properties;
    }
}
