import "jquery";
import "jqueryui";
import { PaletteElementView } from "../view/PaletteElementView"

export class PaletteController {
    public Drag(): void {
        $(".tree-element").draggable({
            helper: function () {
                var clone = $(this).find(".element-img").clone();
                // clone.css("position", "relative");
                return clone;
            },
            cursorAt: {
                top: 15,
                left: 15
            },
            // revert: "invalid"
        })
    }

    public AppendPaletteElement(): void {
        var paletteElement = new PaletteElementView();
        $(".tree-element").append(paletteElement.Content);

        $(".tree-element").treeview({
            persist: "location"
        });
    }

    private ClearContent(): void {
        $(".tree-element").empty();
    }
}