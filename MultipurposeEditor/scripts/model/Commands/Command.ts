export interface Command {
    IsUndoable: boolean;
    Execute(): void;
    Undo(): void;
}