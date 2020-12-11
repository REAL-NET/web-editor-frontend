import { Model } from "./Model";
import { NodeType } from "./NodeType";
import { EdgeType } from "./EdgeType";

export class SceneModel {
    private _model: Model;

    public get Model(): Model {
        return this._model;
    }

    constructor(model: Model = null) {
        this._model = model;
    }
}