import { PaletteController } from "./controller/PaletteController";
import { UndoRedoController } from "./controller/UndoRedoController";
import '../scripts/app.css';
import node from './view/node.png';
import github from './view/github.png';
import trollface from './view/trollface.png';

class Editor {
    timerToken: number;
    paletteController: PaletteController;
    undoRedoController: UndoRedoController;

    constructor() {
        this.undoRedoController = new UndoRedoController();

        this.paletteController = new PaletteController();
        this.paletteController.AppendPaletteElement("node", node);
        this.paletteController.AppendPaletteElement("github", github);
        this.paletteController.AppendPaletteElement("trollface", trollface);
        this.paletteController.Drag(this.undoRedoController);
    }

    start() {
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

window.onload = () => {
    var editor = new Editor();
    editor.start();

    document.addEventListener("keydown", function (event) {
        if (event.code == "KeyZ" && (event.ctrlKey || event.metaKey)) {
            editor.undoRedoController.Undo();
        }
        else if (event.code == "KeyY" && (event.ctrlKey || event.metaKey)) {
            editor.undoRedoController.Redo();
        }
    });
}

function requestSmth(type: string, url: string) {
    var postRequest = new XMLHttpRequest();
    postRequest.open(type, url, false);
    var result;
    postRequest.onload = function () {
        result = this.response;
    }
    postRequest.send();
    return result;
}
