import { PaletteElementView } from "../view/PaletteElementView";
import { UndoRedoController } from "./UndoRedoController";
import { AddElementCommand } from "../model/Commands/AddElementCommand";

export class PaletteController {
    public Drag(undoRedoController: UndoRedoController): void {
        $(".tree-element").draggable({
            helper: function () {
                var clone = $(this).find(".element-img").clone();
                var addElementCommand = new AddElementCommand(clone, () => alert("redo"), () => alert("undo"));//(clone, () => clone.append(document.getElementById("scene")), () => clone.remove());
                addElementCommand.Undo();
                undoRedoController.AddCommand(addElementCommand);
                // clone.css("position", "relative");
                return clone;
            },
            cursorAt: {
                top: 15,
                left: 15
            }
            // revert: "invalid"
        });
    }

    public AppendPaletteElement(name: string, image: string): void {
        var paletteElement = new PaletteElementView(name, image);
        var submenu = document.getElementById("submenu-1");
        submenu.insertAdjacentHTML("beforeend", paletteElement.Content);

        //$(".tree-element").treeview({
        //    persist: "location"
        //});
    }

    private ClearContent(): void {
        $(".tree-element").empty();
    }
}