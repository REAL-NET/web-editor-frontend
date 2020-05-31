import { SceneModel } from "../model/SceneModel";
import { CreateDeleteElementCommand } from "../controller/commands/CreateDeleteElementCommand";
import { ChangeAttributeValueCommand } from "../controller/commands/ChangeAttributeValueCommand";
var mxgraph = require("mxgraph")({
    mxImageBasePath: "./src/images",
    mxBasePath: "./src"
});
export class SceneController {
    constructor(dataModel) {
        this.sceneModel = new SceneModel(dataModel);
    }
    InitGraph() {
        // Checks if browser is supported
        if (!mxgraph.mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxgraph.mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            // Creates the div for the graph
            var graphContainer = document.getElementById('graphContainer');
            // Creates the model and the graph inside the container
            // using the fastest rendering available on the browser
            this.graphModel = new mxgraph.mxGraphModel();
            this.graph = new mxgraph.mxGraph(graphContainer, this.graphModel);
            this.graph.dropEnabled = true;
            this.graph.getView().updateStyle = true;
            this.graph.labelsVisible = false;
            // Matches drag-and-drop inside the graph
            mxgraph.mxDragSource.prototype.getDropTarget = function (graph, x, y) {
                var cell = graph.getCellAt(x, y);
                if (!graph.isValidDropTarget(cell)) {
                    cell = null;
                }
                return cell;
            };
            // Enables new connections in the graph
            this.graph.setConnectable(true);
            this.graph.setMultigraph(false);
        }
    }
    AddPropertiesListeners() {
        this.AddStylesEditorListener();
        this.AddPropertiesEditorListener();
    }
    FuncAddNodeToScene(nodeImage, prototype, metaelement, style = null) {
        var funct = (graph, evt, cell) => {
            var dropMxPoint = graph.getPointForEvent(evt);
            var newDataNode = this.CreateNewDataNode(dropMxPoint.x, dropMxPoint.y, 0, nodeImage, metaelement);
            var createNewElementCommand = new CreateDeleteElementCommand(newDataNode, this.AddNewNodeToDataModel.bind(this), this.RemoveNodeFromDataModel.bind(this));
            createNewElementCommand.Execute();
            graph.stopEditing(false);
            var vertex = this.AddNewElementToSceneByPrototype(prototype, newDataNode, style);
            graph.importCells([vertex], 0, 0, cell);
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
    AddNewElementToSceneByPrototype(prototype, newDataNode, style = null) {
        var vertex = prototype;
        if (style != null) {
            vertex.style = style;
        }
        else {
            vertex.style = this.GetVertexStyle(newDataNode.shape);
        }
        vertex.geometry.x = newDataNode.X;
        vertex.geometry.y = newDataNode.Y;
        vertex.value = newDataNode;
        return vertex;
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
    GetVertexStyle(image) {
        var style = this.graph.getStylesheet().getDefaultVertexStyle();
        //var style = mxgraph.mxStylesheet.prototype.getDefaultVertexStyle();
        style[mxgraph.mxConstants.STYLE_SHAPE] = mxgraph.mxConstants.SHAPE_IMAGE;
        style[mxgraph.mxConstants.STYLE_PERIMETER] = mxgraph.mxPerimeter.RectanglePerimeter;
        style[mxgraph.mxConstants.STYLE_IMAGE] = image;
        return style;
    }
    AddPropertiesEditorListener() {
        this.graph.addListener(mxgraph.mxEvent.CLICK, (sender, evt) => {
            var cell = evt.getProperty("cell"); // cell may be null
            if (cell != null) {
                var element = this.graph.getSelectionCell(cell);
                if (element.vertex) {
                    var el = element.value;
                    var tableRef = document.getElementById('properties').getElementsByTagName('tbody')[0];
                    $("#properties > tbody:last").children().remove();
                    el.properties.forEach((property) => {
                        var newRow = tableRef.insertRow();
                        var propertyNameCell = newRow.insertCell(0);
                        var propertyName = document.createTextNode(property.name);
                        var propertyValueCell = newRow.insertCell(1);
                        // input to react on properties changes
                        var propertyValue = document.createElement("input");
                        propertyValue.value = property.value;
                        propertyValue.setAttribute("style", "display:table-cell; width:100%");
                        propertyValueCell.contentEditable = 'true';
                        propertyNameCell.appendChild(propertyName);
                        propertyValueCell.appendChild(propertyValue);
                        propertyValue.addEventListener('change', updateValue);
                        function updateValue(e) {
                            var changeAttributeValueCommand = new ChangeAttributeValueCommand(el, property, e.target.value, property.value, (node, prop, newVal) => {
                                prop.value = newVal;
                                //Requests.ChangeAttributeValue(this.sceneModel.Model.Name, node.id, prop.name, newVal);
                            }, (node, prop, oldVal) => {
                                prop.value = oldVal;
                                //Requests.ChangeAttributeValue(this.sceneModel.Model.Name, node.id, prop.name, oldVal);
                            });
                            changeAttributeValueCommand.Execute();
                        }
                    });
                }
            }
            evt.consume();
        });
    }
    AddStylesEditorListener() {
        this.graph.addListener(mxgraph.mxEvent.CLICK, (sender, evt) => {
            var tableStyleRef = document.getElementById('style').getElementsByTagName('tbody')[0];
            $("#style > tbody:last").children().remove();
            var cell = evt.getProperty("cell"); // cell may be null
            function updateStyleValue1(e) {
                var style = this.graph.getStylesheet().getDefaultVertexStyle();
                style[mxgraph.mxConstants.STYLE_SHAPE] = e.target.value;
                cell.style = style;
                this.graph.getView().refresh();
                this.graph.refresh(cell, true);
            }
            function updateStyleValue2(e) {
                var style = this.graph.getStylesheet().getDefaultVertexStyle();
                style[mxgraph.mxConstants.STYLE_FILLCOLOR] = e.target.value;
                cell.style = style;
                this.graph.getView().refresh();
                this.graph.refresh(cell, true);
            }
            if (cell != null) {
                var stri = '';
                for (var i in mxgraph.mxCellRenderer.defaultShapes) {
                    stri += i;
                }
                var newStyleRow1 = tableStyleRef.insertRow();
                var styleNameCell1 = newStyleRow1.insertCell(0);
                var styleName1 = document.createTextNode('shape');
                var styleValueCell1 = newStyleRow1.insertCell(1);
                var styleValue1 = document.createElement('input');
                styleValue1.value = cell.style[mxgraph.mxConstants.STYLE_SHAPE];
                styleValue1.setAttribute("style", "display:table-cell; width:100%");
                styleValueCell1.contentEditable = 'true';
                styleNameCell1.appendChild(styleName1);
                styleValueCell1.appendChild(styleValue1);
                styleValue1.addEventListener('change', updateStyleValue1.bind(this));
                var newStyleRow2 = tableStyleRef.insertRow();
                var styleNameCell2 = newStyleRow2.insertCell(0);
                var styleName2 = document.createTextNode('color');
                var styleValueCell2 = newStyleRow2.insertCell(1);
                var styleValue2 = document.createElement('input');
                styleValue2.value = cell.style[mxgraph.mxConstants.STYLE_FILLCOLOR];
                styleValue2.setAttribute("style", "display:table-cell; width:100%");
                styleValueCell2.contentEditable = 'true';
                styleNameCell2.appendChild(styleName2);
                styleValueCell2.appendChild(styleValue2);
                styleValue2.addEventListener('change', updateStyleValue2.bind(this));
            }
            evt.consume();
        });
    }
}
//# sourceMappingURL=SceneController.js.map