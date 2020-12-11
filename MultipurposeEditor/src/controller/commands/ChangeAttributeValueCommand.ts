import {Command} from "./Command";
import {NodeType} from "../../model/NodeType";
import {PropertyType} from "../../model/PropertyType";

export class ChangeAttributeValueCommand implements Command {
    private doFunction: (node: NodeType, property: PropertyType, newValue: string) => void;
    private undoFunction: (node: NodeType, property: PropertyType, oldValue: string) => void;
    private node: NodeType;
    private property: PropertyType;
    private oldValue: string;
    private newValue: string;

    constructor(node: NodeType, property: PropertyType, oldValue:string, newValue: string,
                doFunction: (node: NodeType, property: PropertyType, newValue: string) => void,
                undoFunction: (node: NodeType, property: PropertyType, newValue: string) => void) {
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
        this.node = node;
        this.property = property;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    IsUndoable: true;

    Execute(): void {
        this.doFunction(this.node, this.property, this.newValue);
    }

    Undo(): void {
        this.undoFunction(this.node, this.property, this.oldValue);
    }

}