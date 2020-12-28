import { PaletteModel } from "../model/PaletteModel";
export class PaletteController {
    constructor(metamodel, sceneController) {
        this.elementInitialWidth = 100;
        this.elementInitialHeight = 100;
        this.paletteModel = new PaletteModel(metamodel);
        this.sceneController = sceneController;
        this.initPalette();
    }
    initPalette() {
        var toolbarContainer = document.getElementById('toolbarContainer');
        console.log('start add');
        var ul = document.createElement('ul');
        toolbarContainer.appendChild(ul);
        this.paletteModel.Metamodel.Nodes.forEach((value) => {
            let li = document.createElement('li');
            li.innerHTML += value.name;
            li.classList.add('item-draggable');
            li.setAttribute('draggable', 'true');
            ul.appendChild(li);
        });
        console.log('end add list');
    }
    addToolbarNode(metaelement, elementImage, style = null) {
        // func to create prototype-like element and to add it to the scene
        var funct = this.sceneController.FuncAddNodeToScene(elementImage, metaelement, style);
        // add palette element 
        var toolbarElement = this.toolbar.addMode(null, metaelement.shape, funct);
    }
    addToPalette(dataNode, style) {
        this.addToolbarNode(dataNode, dataNode.shape, style);
    }
}
//# sourceMappingURL=PaletteController.js.map