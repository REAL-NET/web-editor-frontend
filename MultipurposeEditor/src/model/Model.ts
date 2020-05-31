import { NodeType } from "./NodeType";
import { EdgeType } from "./EdgeType";
import { PropertyType } from "./PropertyType";

export class Model {
    readonly name: string;
    readonly metamodel: Model;
    private nodes: NodeType[];
    private edges: EdgeType[];
    private lastId: number;

    public get Nodes(): NodeType[]{
        return this.nodes;
    }
    
    public get Edges(): EdgeType[]{
        return this.edges;
    }
    
    constructor(name: string, edges: EdgeType[] = [], nodes: NodeType[] = [], metamodel: Model = null) {
        this.name = name;
        this.metamodel = metamodel;
        this.nodes = nodes;
        this.edges = edges;
        this.lastId = 0;
    }
    
    public AddNode(newNode: NodeType): NodeType{
        newNode.id = this.lastId;
        this.nodes.push(newNode);
        this.lastId++;
        return newNode;
    }
    
    public AddEdge(newEdge: EdgeType): EdgeType{
        newEdge.id = this.lastId;
        this.edges.push(newEdge);
        this.lastId++;
        return newEdge;
    }
    
    public DeleteNode(node: NodeType){
        this.edges.forEach(function (edge){
           if (edge.source == node || edge.target == node){
               const index = this.DeleteEdge(edge);
           } 
        });
        const index: number = this.nodes.indexOf(node);
        if (index !== -1) {
            this.nodes.splice(index, 1);
        }
    }
    
    public DeleteEdge(edge: EdgeType){
        const index: number = this.edges.indexOf(edge);
        if (index !== -1) {
            this.edges.splice(index, 1);
        }
    }
    
    
    
    
    static createTestModel(): any {
        var model = new Model("TestMetamodel");
        model.nodes.push(new NodeType(0, 0, 1, "1", "Greenhouse/airTemperature.png",
            [new PropertyType("from", "10"), new PropertyType("to", "22")]));
        model.nodes.push(new NodeType(0, 0, 3, "3", "Greenhouse/pourSoil.png",
            [new PropertyType("min", "123")]));
        return model;
    }
    
    static createTestMetamodel(): Model {
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
