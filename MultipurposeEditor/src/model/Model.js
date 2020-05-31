import { NodeType } from "./NodeType";
import { PropertyType } from "./PropertyType";
export class Model {
    constructor(name, edges = [], nodes = [], metamodel = null) {
        this.name = name;
        this.metamodel = metamodel;
        this.nodes = nodes;
        this.edges = edges;
        this.lastId = 0;
    }
    get Nodes() {
        return this.nodes;
    }
    get Edges() {
        return this.edges;
    }
    AddNode(newNode) {
        newNode.id = this.lastId;
        this.nodes.push(newNode);
        this.lastId++;
        return newNode;
    }
    AddEdge(newEdge) {
        newEdge.id = this.lastId;
        this.edges.push(newEdge);
        this.lastId++;
        return newEdge;
    }
    DeleteNode(node) {
        this.edges.forEach(function (edge) {
            if (edge.source == node || edge.target == node) {
                const index = this.DeleteEdge(edge);
            }
        });
        const index = this.nodes.indexOf(node);
        if (index !== -1) {
            this.nodes.splice(index, 1);
        }
    }
    DeleteEdge(edge) {
        const index = this.edges.indexOf(edge);
        if (index !== -1) {
            this.edges.splice(index, 1);
        }
    }
    static createTestModel() {
        var model = new Model("TestMetamodel");
        model.nodes.push(new NodeType(0, 0, 1, "1", "Greenhouse/airTemperature.png", [new PropertyType("from", "10"), new PropertyType("to", "22")]));
        model.nodes.push(new NodeType(0, 0, 3, "3", "Greenhouse/pourSoil.png", [new PropertyType("min", "123")]));
        return model;
    }
    static createTestMetamodel() {
        var model = new Model("TestMetamodel");
        model.nodes.push(new NodeType(0, 0, 1, "heatingOn", "SmartHome/heatingOn.svg"));
        //[new PropertyType("from", "10"), new PropertyType("to", "22")]));
        model.nodes.push(new NodeType(0, 0, 2, "kettleOn", "SmartHome/kettleOn.svg"));
        //[new PropertyType("min", "123")]));
        model.nodes.push(new NodeType(0, 0, 3, "lightOn", "SmartHome/lightOn.svg"));
        model.nodes.push(new NodeType(0, 0, 4, "lightOff", "SmartHome/lightOff.svg"));
        model.nodes.push(new NodeType(0, 0, 5, "heatingOff", "SmartHome/heatingOff.svg"));
        model.nodes.push(new NodeType(0, 0, 6, "electricityOff", "SmartHome/electricityOff.svg"));
        model.nodes.push(new NodeType(0, 0, 7, "tvOff", "SmartHome/tvOff.svg"));
        model.nodes.push(new NodeType(0, 0, 8, "andOperation", "SmartHome/andOperation.svg"));
        model.nodes.push(new NodeType(0, 0, 9, "hotCondition", "SmartHome/hotCondition.svg"));
        model.nodes.push(new NodeType(0, 0, 10, "lightCondition", "SmartHome/lightCondition.svg"));
        model.nodes.push(new NodeType(0, 0, 11, "darkCondition", "SmartHome/darkCondition.svg"));
        //[new PropertyType("from", "10"), new PropertyType("to", "22")]));
        model.nodes.push(new NodeType(0, 0, 12, "coldCondition", "SmartHome/coldCondition.svg"));
        //[new PropertyType("min", "123")]));
        model.nodes.push(new NodeType(0, 0, 13, "entered", "SmartHome/entered.svg"));
        model.nodes.push(new NodeType(0, 0, 14, "exited", "SmartHome/exited.svg"));
        return model;
    }
}
//# sourceMappingURL=Model.js.map