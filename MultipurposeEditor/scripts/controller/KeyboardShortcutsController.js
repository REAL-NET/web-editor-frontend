export class KeyboardShortcutsController {
    constructor(undoRedoController) {
        this.undoRedoController = undoRedoController;
    }
    Undo(e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            this.undoRedoController.Undo();
        }
    }
    Redo(e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
            this.undoRedoController.Redo();
        }
    }
    ActivateUndoRedoShortcuts() {
        document.onkeydown = this.Undo;
        document.onkeydown = this.Redo;
    }
}
//# sourceMappingURL=KeyboardShortcutsController.js.map