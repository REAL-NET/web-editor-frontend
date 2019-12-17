export class UndoRedoController {
    constructor() {
        this.undoList = [];
        this.redoList = [];
    }
    ExecuteCommand(command) {
        if (command.IsUndoable) {
            this.undoList.push(command);
            this.redoList = [];
        }
        command.Execute();
    }
    Undo() {
        if (this.undoList.length > 0) {
            var command = this.undoList.pop();
            this.redoList.push(command);
            command.Undo();
        }
    }
    Redo() {
        if (this.redoList.length > 0) {
            var command = this.redoList.pop();
            this.undoList.push(command);
            command.Execute();
        }
    }
}
//# sourceMappingURL=UndoRedoController.js.map