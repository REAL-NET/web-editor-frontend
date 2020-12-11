var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NodeType } from "./model/NodeType";
import { Model } from "./model/Model";
import { PropertyType } from "./model/PropertyType";
import { EdgeType } from "./model/EdgeType";
export class Requests {
    static Request(type, url) {
        var postRequest = new XMLHttpRequest();
        postRequest.open(type, url, false);
        var result;
        postRequest.onload = function () {
            result = this.response;
        };
        postRequest.send();
        return result;
    }
    ;
    static RequestAsync(type, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(type, url, true);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                }
                else {
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
    static CreateModel(metamodelName, modelName) {
        //Requests.Request('POST', `http://localhost:8000/api/repo/model/${metamodelName}/${modelName}/`);
        var newNodes = this.GetNotAbstractNodes(modelName);
        let newEdges = [];
        var notAbstractEdges = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${modelName}/notAbstractEdges/`));
        notAbstractEdges.forEach(function (edge) {
            var sourceNode = null;
            var targetNode = null;
            newNodes.forEach(function (node) {
                if (node.id == edge.from) {
                    sourceNode = node;
                }
                if (node.id == edge.to) {
                    targetNode = node;
                }
            });
            let properties = [];
            edge.attributes.forEach(function (property) {
                properties.push(new PropertyType(property.name, property.stringValue));
            });
            newEdges.push(new EdgeType(edge.id, edge.name, edge.shape, properties, sourceNode, targetNode));
        });
        let newDataModel = new Model(metamodelName, newEdges, newNodes);
        return newDataModel;
    }
    static RequestMetamodel(metamodelName) {
        let newNodes = this.GetNotAbstractNodes(metamodelName);
        let newEdges = [];
        var notAbstractEdges = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${metamodelName}/notAbstractEdges/`));
        notAbstractEdges.forEach(function (edge) {
            var abstractNode = new NodeType(0, 0, -1, "");
            let properties = [];
            edge.attributes.forEach(function (property) {
                properties.push(new PropertyType(property.name, property.stringValue));
            });
            newEdges.push(new EdgeType(edge.id, edge.name, edge.shape, properties, abstractNode, abstractNode));
        });
        var newMetamodel = new Model(metamodelName, newEdges, newNodes);
        return newMetamodel;
    }
    static GetNotAbstractNodes(modelName) {
        let newNodes = [];
        var notAbstractNodes = JSON.parse(Requests.Request('GET', `http://localhost:8000/api/repo/Model/${modelName}/notAbstractNodes/`));
        notAbstractNodes.forEach(function (node) {
            let properties = [];
            node.attributes.forEach(function (property) {
                properties.push(new PropertyType(property.name, property.stringValue));
            });
            newNodes.push(new NodeType(0, 0, node.id, node.name, node.shape, properties));
        });
        return newNodes;
    }
    static CreateNewNode(modelName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Requests.RequestAsync('POST', `http://localhost:8000/api/repo/Element/${modelName}/${id}/`);
        });
    }
    static DeleteNode(modelName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Requests.RequestAsync('DELETE', `http://localhost:8000/api/repo/Element/${modelName}/${id}/`);
        });
    }
    static ChangeAttributeValue(modelName, elementId, attributeName, newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Requests.RequestAsync('DELETE', `http://localhost:8000/api/repo/Element/${modelName}/${elementId}/attribute/${attributeName}/value/${newValue}/`);
        });
    }
}
//# sourceMappingURL=Requests.js.map