import { PaletteElementView } from "../view/PaletteElementView";
// import { Command } from "../Command";
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