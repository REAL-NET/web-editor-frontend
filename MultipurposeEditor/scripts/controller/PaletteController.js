import { PaletteElementView } from "../view/PaletteElementView";
import { AddElementCommand } from "../model/Commands/AddElementCommand";
export class PaletteController {
    Drag(undoRedoController) {
        $(".tree-element").draggable({
            helper: function () {
                var clone = $(this).find(".element-img").clone();
                var addElementCommand = new AddElementCommand(clone, () => alert("redo"), () => alert("undo")); //(clone, () => clone.append(document.getElementById("scene")), () => clone.remove());
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
    AppendPaletteElement(name, image) {
        var paletteElement = new PaletteElementView(name, image);
        var submenu = document.getElementById("submenu-1");
        submenu.insertAdjacentHTML("beforeend", paletteElement.Content);
        //$(".tree-element").treeview({
        //    persist: "location"
        //});
    }
    ClearContent() {
        $(".tree-element").empty();
    }
}
//# sourceMappingURL=PaletteController.js.map