import { PaletteModel } from "../model/PaletteModel";
import { NodeType } from "../model/NodeType";
var mxgraph = require("mxgraph")({
    mxImageBasePath: "./src/images",
    mxBasePath: "./src"
});
export class PaletteController {
    constructor(graph, metamodel, sceneController) {
        this.elementInitialWidth = 100;
        this.elementInitialHeight = 100;
        this.graph = graph;
        this.paletteModel = new PaletteModel(metamodel);
        this.sceneController = sceneController;
        this.initPalette(graph);
    }
    initPalette(graph) {
        var toolbarContainer = document.getElementById('toolbarContainer');
        this.toolbar = new mxgraph.mxToolbar(toolbarContainer);
        this.toolbar.enabled = false;
        this.paletteModel.Metamodel.Nodes.forEach((value) => {
            var vertex = new mxgraph.mxCell(null, new mxgraph
                .mxGeometry(0, 0, this.elementInitialWidth, this.elementInitialHeight));
            vertex.setVertex(true);
            this.addToolbarNode(graph, vertex, value, value.shape);
        });
    }
    addToolbarNode(graph, prototype, metaelement, elementImage, style = null) {
        // func to create prototype-like element and to add it to the scene
        var funct = this.sceneController.FuncAddNodeToScene(elementImage, prototype, metaelement, style);
        // add palette element 
        var toolbarElement = this.toolbar.addMode(null, metaelement.shape, funct);
        // make palette element draggable and assign with function
        mxgraph.mxUtils.makeDraggable(toolbarElement, graph, funct);
    }
    addNewShape(xmlDoc) {
        var root = xmlDoc;
        var shape = root.firstChild;
        while (shape != null) {
            if (shape.nodeType == mxgraph.mxConstants.NODETYPE_ELEMENT) {
                mxgraph.mxStencilRegistry.addStencil('and', new mxgraph.mxStencil(shape));
                var dataNode = new NodeType(0, 0, 0, '');
                this.paletteModel.Metamodel.AddNode(dataNode);
                var style = this.graph.getStylesheet().getDefaultVertexStyle();
                style[mxgraph.mxConstants.STYLE_SHAPE] = mxgraph.mxStencilRegistry.stencils['and'];
                this.addToPalette(this.graph, dataNode, style);
            }
            shape = shape.nextSibling;
        }
    }
    addToPalette(graph, dataNode, style) {
        var toolbarContainer = document.getElementById('toolbarContainer');
        this.toolbar = new mxgraph.mxToolbar(toolbarContainer);
        this.toolbar.enabled = false;
        var w = 302;
        var h = 102;
        var vertex = new mxgraph.mxCell(null, new mxgraph.mxGeometry(0, 0, w, h));
        vertex.setVertex(true);
        this.addToolbarNode(graph, vertex, dataNode, dataNode.shape, style);
    }
}
//# sourceMappingURL=PaletteController.js.map