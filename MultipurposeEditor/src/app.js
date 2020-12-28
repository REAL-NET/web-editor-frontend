import { PaletteController } from "./controller/PaletteController";
import { SceneController } from "./controller/SceneController";
import './../src/app.css';
import { Model } from "./model/Model";
import { UndoRedoController } from "./controller/UndoRedoController";
import 'regenerator-runtime/runtime';
class MyEditor {
    constructor() {
        this.undoRedoController = new UndoRedoController();
        //this.metamodel = Requests.RequestMetamodel("SHMetamodelForGraphEditor");
        //this.model = Requests.CreateModel("SHMetamodelForGraphEditor", "SHModel2");
        this.metamodel = Model.createTestMetamodel();
        this.model = Model.createTestModel();
        this.sceneController = new SceneController(this.model);
        this.sceneController.InitGraph();
        this.paletteController = new PaletteController(this.metamodel, this.sceneController);
        //document.getElementById('generate').addEventListener('click', this.gener);
    }
    start() {
    }
    stop() {
        clearTimeout(this.timerToken);
    }
}
window.onload = () => {
    var editor = new MyEditor();
    document.addEventListener("keydown", function (event) {
        if (event.code == "KeyZ" && (event.ctrlKey || event.metaKey)) {
            editor.undoRedoController.Undo();
        }
        else if (event.code == "KeyY" && (event.ctrlKey || event.metaKey)) {
            editor.undoRedoController.Redo();
        }
    });
    editor.start();
};
//# sourceMappingURL=app.js.map