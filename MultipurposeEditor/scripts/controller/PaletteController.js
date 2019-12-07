import { PaletteElementView } from "../view/PaletteElementView";
export class PaletteController {
    Drag() {
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
        });
    }
    AppendPaletteElement() {
        var paletteElement = new PaletteElementView();
        $(".tree-element").append(paletteElement.Content);
        //$(".tree-element").treeview({
        //    persist: "location"
        //});
    }
    ClearContent() {
        $(".tree-element").empty();
    }
}
//# sourceMappingURL=PaletteController.js.map