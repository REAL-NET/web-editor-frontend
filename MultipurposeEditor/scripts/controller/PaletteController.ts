import { PaletteElementView } from "../view/PaletteElementView"
// import { Command } from "../Command";

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