import {NodeType} from "./model/NodeType";
import {Model} from "./model/Model";
import {PropertyType} from "./model/PropertyType";
import {EdgeType} from "./model/EdgeType";

export class Requests
{
    public static Request(type : any, url : any) {
        var postRequest = new XMLHttpRequest();
        postRequest.open(type, url, false);
        var result;
        postRequest.onload = function () {
            result = this.response;
        };
        
        postRequest.send();
        return result;
    };

    public static RequestAsync (type : any, url : any){// function makeRequest(method, url) {
    return new Promise<number>(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
    
    public static CreateModel(metamodelName: string, modelName: string): Model{
        //Requests.Request('POST', `http://localhost:8000/api/repo/model/${metamodelName}/${modelName}/`);

        var newNodes: NodeType[] = this.GetNotAbstractNodes(modelName);

        let newEdges: EdgeType[] = [];
        var notAbstractEdges = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${modelName}/notAbstractEdges/`));
        notAbstractEdges.forEach(function(edge: any)
            {
                var sourceNode: NodeType = null;
                var targetNode: NodeType = null;

                newNodes.forEach(function(node){
                    if (node.id == edge.from){
                        sourceNode = node;
                    }
                    if (node.id == edge.to) {
                        targetNode = node;
                    }
                });

                let properties: PropertyType[] = [];
                edge.attributes.forEach(function(property: any){
                    properties.push(new PropertyType(property.name, property.stringValue));
                });
                newEdges.push(new EdgeType(edge.id, edge.name, edge.shape, properties, sourceNode, targetNode));
            }
        );

        let newDataModel = new Model(metamodelName, newEdges, newNodes);

        return newDataModel;
    }

    public static RequestMetamodel(metamodelName: string): Model{
        let newNodes: NodeType[] = this.GetNotAbstractNodes(metamodelName);

        let newEdges: EdgeType[] = [];
        var notAbstractEdges = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${metamodelName}/notAbstractEdges/`));
        notAbstractEdges.forEach(function(edge: any)
            {
                var abstractNode = new NodeType(0, 0, -1, "");
                let properties: PropertyType[] = [];
                edge.attributes.forEach(function(property: any){
                    properties.push(new PropertyType(property.name, property.stringValue));
                });
                newEdges.push(new EdgeType(edge.id, edge.name, edge.shape, properties, abstractNode, abstractNode));
            }
        );

        var newMetamodel = new Model(metamodelName, newEdges, newNodes);

        return newMetamodel;
    }
    
    private static GetNotAbstractNodes(modelName: string): NodeType[]{
        let newNodes: NodeType[] = [];
        var notAbstractNodes = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${modelName}/notAbstractNodes/`));
        notAbstractNodes.forEach(function(node: any)
            {
                let properties: PropertyType[] = [];
                node.attributes.forEach(function(property: any){
                    properties.push(new PropertyType(property.name, property.stringValue));
                });
                newNodes.push(new NodeType(0, 0, node.id, node.name, node.shape, properties));
            }
        );

        return newNodes;
    }
    
    public static async CreateNewNode(modelName: string, id: number): Promise<number>{
        return await Requests.RequestAsync('POST', `http://localhost:8000/api/repo/Element/${modelName}/${id}/`);
    }
    
    public static async DeleteNode(modelName: string, id: number) {
        await Requests.RequestAsync('DELETE', `http://localhost:8000/api/repo/Element/${modelName}/${id}/`);
    }
    
    public static async ChangeAttributeValue(modelName: string, elementId: number, attributeName: string, newValue: string) {
        await Requests.RequestAsync('DELETE', `http://localhost:8000/api/repo/Element/${modelName}/${elementId}/attribute/${attributeName}/value/${newValue}/`);
    }
}