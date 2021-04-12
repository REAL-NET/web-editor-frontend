export class Requests
{
    public static Request(type : any, url : any): string | undefined {
        try {
            var postRequest = new XMLHttpRequest();
            postRequest.open(type, url, false);
            var result;
            postRequest.onload = function () {
                result = this.response;
            };

            postRequest.send();
            return result;
        } catch (e) {
            return undefined;
        }
    };
}

   /* public static RequestMetamodel(metamodelName: string): Model | undefined {
        let newNodes: NodeType[] = this.GetNotAbstractNodes(metamodelName);
        let newEdges: EdgeType[] = [];
        var newMetamodel;
        let request = Requests.Request('GET', `http://localhost:8000/api/repo/Model/${metamodelName}/notAbstractEdges/`);
        if (request !== undefined) {
            var notAbstractEdges = JSON.parse(request);
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
            newMetamodel = new Model(metamodelName, newEdges, newNodes);
        }

        return newMetamodel;
    }
    
    private static GetNotAbstractNodes(modelName: string): NodeType[]{
        let newNodes: NodeType[] = [];
        let request = Requests.Request('GET', `http://localhost:8000/api/repo/Model/${modelName}/notAbstractNodes/`);
        if (request !== undefined) {
            var notAbstractNodes = JSON.parse(request);
            notAbstractNodes.forEach(function(node: any)
                {
                    let properties: PropertyType[] = [];
                    node.attributes.forEach(function(property: any){
                        properties.push(new PropertyType(property.name, property.stringValue));
                    });
                    newNodes.push(new NodeType(0, 0, node.id, node.name, node.shape, properties));
                }
            );
        }
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
}*/