import { UndoRedoController } from "./UndoRedoController";

export class KeyboardShortcutsController {
    private undoRedoController: UndoRedoController;

    private Undo(e: any): void {
        var evtobj = window.event ? event : e
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            this.undoRedoController.Undo();
        }
    }

    private Redo(e: any): void {
        var evtobj = window.event ? event : e
        if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
            this.undoRedoController.Redo();
        }
    }

    constructor(undoRedoController: UndoRedoController) {
        this.undoRedoController = undoRedoController;
    }

    public ActivateUndoRedoShortcuts(): void {
        document.onkeydown = this.Undo;
        document.onkeydown = this.Redo;
    }
}