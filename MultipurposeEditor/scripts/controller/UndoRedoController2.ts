import { Command } from "../model/Commands/Command"

export class UndoRedoController2 {
    public stack: Command[];
    private pointer: number;
    private maxLength: number = 1000;

    constructor() {
        this.stack = [];
        this.pointer = -1;
    }

    public AddCommand(command: Command): void {
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

    private PopElements(number: number): void {
        if (number > 0 && number < this.stack.length) {
            while (number > 0) {
                this.stack.pop();
                --number;
            }
        }
    }

    public Undo(): void {
        if (this.pointer > -1) {
            this.stack[this.pointer].Undo();
            --this.pointer;
        }
    }

    public Redo(): void {
        if (this.pointer < this.stack.length - 1) {
            this.stack[this.pointer].Execute();
            ++this.pointer;
        }
    }
}