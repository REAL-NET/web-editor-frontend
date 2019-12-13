import { UndoRedoController } from "./UndoRedoController";

export class KeyboardShortcutsController {
    private undoRedoController: UndoRedoController;

    constructor(undoRedoController: UndoRedoController) {
        this.undoRedoController = undoRedoController;
    }

    private UndoRedo(e: any): void {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            this.undoRedoController.Undo();
        }
        else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
            this.undoRedoController.Redo();
        }
    }

    public ActivateUndoRedoShortcuts(): void {
        document.onkeydown = this.UndoRedo;
    }
}