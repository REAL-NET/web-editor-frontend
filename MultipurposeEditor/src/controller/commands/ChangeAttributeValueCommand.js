export class ChangeAttributeValueCommand {
    constructor(node, property, oldValue, newValue, doFunction, undoFunction) {
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
        this.node = node;
        this.property = property;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    Execute() {
        this.doFunction(this.node, this.property, this.newValue);
    }
    Undo() {
        this.undoFunction(this.node, this.property, this.oldValue);
    }
}
//# sourceMappingURL=ChangeAttributeValueCommand.js.map