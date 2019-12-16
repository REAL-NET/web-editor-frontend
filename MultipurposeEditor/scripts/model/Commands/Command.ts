export interface Command {
    IsUndoable: boolean;
    Redo(): void;
    Undo(): void;
}