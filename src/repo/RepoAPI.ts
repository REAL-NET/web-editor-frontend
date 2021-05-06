import {Requests} from "./Requests";
import {ModelInfo} from "../model/ModelInfo";
import {Model} from "../model/Model";
import {Relationship} from "../model/Relationship";
import {Association} from "../model/Association";
import {Node} from "../model/Node"
import {Generalization} from "../model/Generalization";
import {Attribute} from "../model/Attribute";
import {Slot} from "../model/Slot";
import {ElementInfo} from "../model/ElementInfo";

export class RepoAPI {
    static host: string = "http://localhost:8000/api/repo"


    // Models

    public static AllModels(): ModelInfo[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/all`));
    }

    public static GetModel(modelName: string): Model | undefined {
        let result: Model | undefined = this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}`));
        console.debug(result);
        return result;
    }

    public static GetModelMetaNodes(modelName: string): ElementInfo[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metanodes`));
    }

    public static GetModelMetaEdges(modelName: string): ElementInfo[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metaedges`));
    }

    public static DeleteModel(modelName: string) {
        Requests.Request("DELETE", `${RepoAPI.host}/Model/${modelName}`)
    }

    public static CreateDeepMetamodel(modelName: string) {
        return Requests.Request("POST", `${RepoAPI.host}/Model/${modelName}`)
    }

    public static CreateModel(metamodelName: string, modelName: string) {
        return Requests.Request("POST", `${RepoAPI.host}/Model/${metamodelName}/${modelName}`)
    }

    public static RenameModel(oldName: string, newName: string) {
        return Requests.Request("PUT", `${RepoAPI.host}/Model/${oldName}/name/${newName}`)
    }


    // Elements

    public static GetElement(modelName: string, elementName: string): Element | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}`))
    }

    public static SetElementName(modelName: string, oldName: string, newName: string): ElementInfo | undefined {
        return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/name/${newName}`));
    }

    public static DeleteElement(modelName: string, elementName: string) {
        Requests.Request("DELETE", `${RepoAPI.host}/Element/${modelName}/${elementName}`)
    }

    public static GetNode(modelName: string, elementName: string): Node | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/node/${modelName}/${elementName}`))
    }

    public static GetRelationship(modelName: string, elementName: string): Relationship | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/relationship/${modelName}/${elementName}`))
    }

    public static GetAssociation(modelName: string, elementName: string): Association | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/association/${modelName}/${elementName}`))
    }

    public static CreateNode(modelName: string, name: string, level: number, potency: number): Node | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/${modelName}/${name}/${level}/${potency}`))
    }

    public static CreateGeneralization(modelName: string, name: string, sourceName: string, targetName: string, level: number, potency: number): Generalization | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/generalization/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}`))
    }

    public static CreateAssociations(modelName: string, name: string, sourceName: string, targetName: string,
                                     level: number, potency: number,
                                     minSource: number, maxSource: number, minTarget: number, maxTarget: number): Node | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}/${minSource}/${maxSource}/${minTarget}/${maxTarget}`))
    }

    public static InstantiateNode(modelName: string, name: string, parentModel: string, parentName: string): Node | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/${modelName}/${parentModel}/${parentName}/${name}`))
    }
    
    public static InstantiateAssociation(modelName: string, name: string, parentModel: string, parentName: string,
                                         sourceName: string, targetName: string): Association | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/${modelName}/${name}/${parentModel}/${parentName}/${sourceName}/${targetName}`))
    }

    public static GetAttributes(modelName: string, name: string): Attribute[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/attributes`))
    }

    public static GetAttribute(modelName: string, elementName: string, attributeName: string): Attribute | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}`))
    }

    public static AddAttribute(modelName: string, elementName: string, attributeName: string, typeName: string, level: number, potency: number): Attribute | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${typeName}/${level}/${potency}`))
    }

    public static SetAttributeSingle(modelName: string, elementName: string, attributeName: string, single: boolean): Attribute | undefined {
        return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${single}`))
    }

    public static GetSlots(modelName: string, name: string): Slot[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/slots`))
    }

    public static GetSlot(modelName: string, elementName: string, attributeName: string): Slot | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}`))
    }

    public static AddSlot(modelName: string, elementName: string, attributeName: string, valueName: string, level: number, potency: number): Slot | undefined {
        return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}/${level}/${potency}`))
    }

    public static SetSlotValue(modelName: string, elementName: string, attributeName: string, valueName: string): Slot | undefined {
        return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}`))
    }

    private static ParseJson<Type>(json: string | undefined): Type | undefined {
        try {
            if (json === undefined) {
                return undefined;
            }
            return JSON.parse(json)
        } catch (e) {
            return undefined;
        }
    }

}