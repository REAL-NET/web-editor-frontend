import {NodeType} from "../model/NodeType";
import {PropertyType} from "../model/PropertyType";
import {Model} from "../model/Model";
import {SceneModel} from "../model/SceneModel";
import {Requests} from "../Requests";
import {CreateDeleteElementCommand} from "../controller/commands/CreateDeleteElementCommand";
import { ChangeAttributeValueCommand } from "../controller/commands/ChangeAttributeValueCommand";
import "regenerator-runtime/runtime";
import Rete from "rete";
import { TextControl } from "./reteUtils/TextControl";

export class SceneController{
    
    public sceneModel: SceneModel;
    public editor: any;
    
    constructor(dataModel: Model){
        this.sceneModel = new SceneModel(dataModel);
    }

    public InitGraph() : void {
        var graphContainer = document.getElementById('graphContainer');
        var editor = new Rete.NodeEditor('editor@0.1.0', graphContainer);
        this.editor = editor;
    }

    public FuncAddNodeToScene(nodeImage: string, metaelement: NodeType, style: any = null): any{
        var funct = (evt: any) => {

            var dropPoint = { x: evt.pageX, y: evt.pageY };
            
            var newDataNode = this.CreateNewDataNode(dropPoint.x, dropPoint.y, 0, nodeImage, metaelement);
            
            var createNewElementCommand: CreateDeleteElementCommand = 
                new CreateDeleteElementCommand(newDataNode, this.AddNewNodeToDataModel.bind(this), this.RemoveNodeFromDataModel.bind(this));
            
            createNewElementCommand.Execute();

            this.AddNewElementToScene(newDataNode);
        };
        return funct;
    }
    
    private CreateNewDataNode(x: any, y: any, id: number, shape: string = "", metaelement: NodeType, name: string = ""): NodeType {
        var newDataNode: NodeType = Object.create(metaelement);
        //jQuery.extend(true, newDataNode, metaelement);
        var id = 0;
        newDataNode.id = id;
        return newDataNode;
    }

    private AddNewElementToScene(newDataNode: NodeType) {
        const anyTypeSocket = new Rete.Socket('Any type');
        var newNode = new Rete.Node(newDataNode.name);
        var inp1 = new Rete.Input("inp", "Any type", anyTypeSocket)
        var out1 = new Rete.Output('out', "Any type", anyTypeSocket);
        newDataNode.properties.map(x => {
            var control = new Rete.Control(x.name);
            newNode.addControl(control);
        })
        return newNode.addOutput(out1).addInput(inp1);
    }

    private AddNewNodeToDataModel(node: NodeType){
        //var id = Requests.CreateNewNode(this.sceneModel.Model.name, metaelement.id);
        //node.id = id;
        this.sceneModel.Model.AddNode(node);
    }
    
    private RemoveNodeFromDataModel(node: NodeType){
        //Requests.DeleteNode(this.sceneModel.Model.name, node.id);
        this.sceneModel.Model.DeleteNode(node)
    }
}