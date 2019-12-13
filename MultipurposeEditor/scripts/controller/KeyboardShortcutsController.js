export class KeyboardShortcutsController {
    constructor(undoRedoController) {
        this.undoRedoController = undoRedoController;
    }
    UndoRedo(e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            this.undoRedoController.Undo();
        }
        else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
            this.undoRedoController.Redo();
        }
    }
    ActivateUndoRedoShortcuts() {
        document.onkeydown = this.UndoRedo;
    }
}
//# sourceMappingURL=KeyboardShortcutsController.js.map