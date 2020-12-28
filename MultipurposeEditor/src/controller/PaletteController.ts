import { PaletteModel } from "../model/PaletteModel";
import {NodeType} from "../model/NodeType";
import {SceneController} from "./SceneController";
import {Model} from "../model/Model";

export class PaletteController
{
    private elementInitialWidth = 100;
    private elementInitialHeight = 100;
    
    private paletteModel: PaletteModel;
    private toolbar: any;
    private sceneController: SceneController;
    
    constructor(metamodel: Model, sceneController: SceneController) {
        this.paletteModel = new PaletteModel(metamodel);
        this.sceneController = sceneController;
        this.initPalette();
    }

    public initPalette() {
        var toolbarContainer = document.getElementById('toolbarContainer');
        console.log('start add');
        var ul = document.createElement('ul');
        toolbarContainer.appendChild(ul);

        this.paletteModel.Metamodel.Nodes.forEach((value: NodeType) => {
            let li = document.createElement('li');
            li.innerHTML += value.name;
            li.classList.add('item-draggable');
            li.setAttribute('draggable', 'true');
            ul.appendChild(li);            
        });
        console.log('end add list');
    }

    public addToolbarNode(metaelement: NodeType, elementImage: string, style: any = null) {
        // func to create prototype-like element and to add it to the scene
        var funct = this.sceneController.FuncAddNodeToScene(elementImage, metaelement, style);
        
        // add palette element 
        var toolbarElement = this.toolbar.addMode(null, metaelement.shape, funct);
    }

    public addToPalette(dataNode: any, style: any){
        this.addToolbarNode(dataNode, dataNode.shape, style);
    }
}