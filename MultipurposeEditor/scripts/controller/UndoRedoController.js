export class UndoRedoController {
    constructor() {
        this.maxLength = 1000;
        this.stack = [];
        this.pointer = -1;
    }
    AddCommand(command) {
        if (command.IsUndoable) {
            if (this.pointer < this.stack.length - 1) {
                this.PopElements(this.stack.length - 1 - this.pointer);
            }
            this.stack.push(command);
            if (this.stack.length > this.maxLength) {
                this.stack.shift();
            }
            else {
                ++this.pointer;
            }
        }
    }
    PopElements(number) {
        if (number > 0 && number < this.stack.length) {
            while (number > 0) {
                this.stack.pop();
                --number;
            }
        }
    }
    Undo() {
        if (this.pointer > -1) {
            this.stack[this.pointer].Undo();
            --this.pointer;
        }
    }
    Redo() {
        if (this.pointer < this.stack.length - 1) {
            this.stack[this.pointer].Execute();
            ++this.pointer;
        }
    }
}
//# sourceMappingURL=UndoRedoController.js.map