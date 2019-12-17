import { Command } from "../model/Commands/Command"

export class UndoRedoController {
    private undoList: Command[];
    private redoList: Command[];

    constructor() {
        this.undoList = [];
        this.redoList = [];
    }

    public ExecuteCommand(command: Command): void {
        if (command.IsUndoable) {
            this.undoList.push(command);
            this.redoList = [];
        }
        command.Execute();
    }

    public Undo(): void {
        if (this.undoList.length > 0) {
            var command = this.undoList.pop();
            this.redoList.push(command);
            command.Undo();
        }
    }

    public Redo(): void {
        if (this.redoList.length > 0) {
            var command = this.redoList.pop();
            this.undoList.push(command);
            command.Execute();
        }
    }
}