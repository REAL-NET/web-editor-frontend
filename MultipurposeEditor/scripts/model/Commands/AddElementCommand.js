export class AddElementCommand {
    constructor(element, executeFunction, revertFunction) {
        this.element = element;
        this.executeFunction = executeFunction;
        this.revertFunction = revertFunction;
    }
    get IsUndoable() {
        return true;
    }
    Redo() {
        this.executeFunction();
    }
    Undo() {
        this.revertFunction();
    }
}
//# sourceMappingURL=AddElementCommand.js.map