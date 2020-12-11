export class CreateDeleteElementCommand {
    constructor(node, doFunction, undoFunction) {
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
        this.node = node;
    }
    Execute() {
        this.doFunction(this.node);
    }
    Undo() {
        this.undoFunction(this.node);
    }
}
//# sourceMappingURL=CreateDeleteElementCommand.js.map