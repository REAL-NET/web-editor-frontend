import { Command } from "./Command";
import { PaletteElementView } from "../../view/PaletteElementView";

export class CloneElementCommand implements Command {
    private element: PaletteElementView;
    private executeFunction: (element: PaletteElementView) => void;
    private revertFunction: (element: PaletteElementView) => void;

    get IsUndoable(): boolean {
        return true;
    }

    constructor(element: PaletteElementView, executeFunction: (element: PaletteElementView) => void, revertFunction: (element: PaletteElementView) => void) {
        this.element = element;
        this.executeFunction = executeFunction;
        this.revertFunction = revertFunction;
    }

    public Execute(): void {
        this.executeFunction(this.element);
    }

    public Undo(): void {
        this.revertFunction(this.element);
    }
}