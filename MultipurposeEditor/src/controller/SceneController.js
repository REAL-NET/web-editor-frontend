import { SceneModel } from "../model/SceneModel";
import { CreateDeleteElementCommand } from "../controller/commands/CreateDeleteElementCommand";
import "regenerator-runtime/runtime";
import Rete from "rete";
export class SceneController {
    constructor(dataModel) {
        this.sceneModel = new SceneModel(dataModel);
    }
    InitGraph() {
        var graphContainer = document.getElementById('graphContainer');
        var editor = new Rete.NodeEditor('editor@0.1.0', graphContainer);
        this.editor = editor;
    }
    FuncAddNodeToScene(nodeImage, metaelement, style = null) {
        var funct = (evt) => {
            var dropPoint = { x: evt.pageX, y: evt.pageY };
            var newDataNode = this.CreateNewDataNode(dropPoint.x, dropPoint.y, 0, nodeImage, metaelement);
            var createNewElementCommand = new CreateDeleteElementCommand(newDataNode, this.AddNewNodeToDataModel.bind(this), this.RemoveNodeFromDataModel.bind(this));
            createNewElementCommand.Execute();
            this.AddNewElementToScene(newDataNode);
        };
        return funct;
    }
    CreateNewDataNode(x, y, id, shape = "", metaelement, name = "") {
        var newDataNode = Object.create(metaelement);
        //jQuery.extend(true, newDataNode, metaelement);
        var id = 0;
        newDataNode.id = id;
        return newDataNode;
    }
    AddNewElementToScene(newDataNode) {
        const anyTypeSocket = new Rete.Socket('Any type');
        var newNode = new Rete.Node(newDataNode.name);
        var inp1 = new Rete.Input("inp", "Any type", anyTypeSocket);
        var out1 = new Rete.Output('out', "Any type", anyTypeSocket);
        newDataNode.properties.map(x => {
            var control = new Rete.Control(x.name);
            newNode.addControl(control);
        });
        return newNode.addOutput(out1).addInput(inp1);
    }
    AddNewNodeToDataModel(node) {
        //var id = Requests.CreateNewNode(this.sceneModel.Model.name, metaelement.id);
        //node.id = id;
        this.sceneModel.Model.AddNode(node);
    }
    RemoveNodeFromDataModel(node) {
        //Requests.DeleteNode(this.sceneModel.Model.name, node.id);
        this.sceneModel.Model.DeleteNode(node);
    }
}
//# sourceMappingURL=SceneController.js.map