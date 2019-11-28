// import { NodeType } from "../model/NodeType"
import { PaletteTree } from "../model/PaletteTree"
import { PaletteElementView } from "../view/PaletteElementView"
import "jquery";
import "jqueryui";

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
}