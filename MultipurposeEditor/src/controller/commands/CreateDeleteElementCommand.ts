import {Command} from "./Command";
import {NodeType} from "../../model/NodeType";

export class CreateDeleteElementCommand implements Command {
    private doFunction: (node: NodeType) => void;
    private undoFunction: (node: NodeType) => void;
    private node: NodeType;
    
    constructor(node: NodeType, doFunction: (node: NodeType) => void, undoFunction: (node: NodeType) => void) {
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
        this.node = node;
    }
    
    IsUndoable: true;

    Execute(): void {
        this.doFunction(this.node);
    }

    Undo(): void {
        this.undoFunction(this.node);
    }
    
}