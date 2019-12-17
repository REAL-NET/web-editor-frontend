import { Command } from "./Command";

export class AddElementCommand implements Command {
    private element: JQuery<any>;
    private executeFunction: () => void;
    private revertFunction: () => void;

    get IsUndoable(): boolean {
        return true;
    }

    constructor(element: JQuery<any>, executeFunction: () => void, revertFunction: () => void) {
        this.element = element;
        this.executeFunction = executeFunction;
        this.revertFunction = revertFunction;
    }

    public Execute(): void {
        this.executeFunction();
    }

    public Undo(): void {
        this.revertFunction();
    }
}