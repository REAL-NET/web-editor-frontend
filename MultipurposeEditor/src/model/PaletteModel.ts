import { Model } from "./Model";
import { NodeType } from "./NodeType";
import { EdgeType } from "./EdgeType";

export class PaletteModel {
    private _metamodel: Model;

    public get Metamodel(): Model {
        return this._metamodel;
    }

    constructor(metamodel: Model = null) {
        this._metamodel = metamodel;
    }
}