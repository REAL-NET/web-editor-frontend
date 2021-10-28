import api from './api'
import {Element} from "../model/Element";
import {ElementInfo} from "../model/ElementInfo";
import {Node} from "../model/Node";
import {Relationship} from "../model/Relationship";
import {Association} from "../model/Association";
import {Generalization} from "../model/Generalization";
import {Attribute} from "../model/Attribute";
import {Slot} from "../model/Slot";

export const GetElement = async (modelName: string, elementName: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${elementName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Element = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetElement(modelName: string, elementName: string): Element | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}`))
// }

export const SetElementName = async (modelName: string, oldName: string, newName: string) => {
    try {
        const response = await api.put(`deepElement/${modelName}/${oldName}/name/${newName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static SetElementName(modelName: string, oldName: string, newName: string): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/name/${newName}`));
// }

export const SetElementLevel = async (modelName: string, oldName: string, level: number) => {
    try {
        const response = await api.put(`deepElement/${modelName}/${oldName}/level/${level}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static SetElementLevel(modelName: string, oldName: string, level: number): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/level/${level}`));
// }

export const SetElementPotency = async (modelName: string, oldName: string, potency: number) => {
    try {
        const response = await api.put(`deepElement/${modelName}/${oldName}/potency/${potency}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static SetElementPotency(modelName: string, oldName: string, potency: number): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/potency/${potency}`));
// }

export const DeleteElement = async (modelName: string, elementName: string) => {
    try {
        await api.delete(`deepElement/${modelName}/${elementName}`);
    } catch (error) {
        console.log(error);
    }
};
// public static DeleteElement(modelName: string, elementName: string) {
//     Requests.Request("DELETE", `${RepoAPI.host}/Element/${modelName}/${elementName}`)
// }

export const GetNode = async (modelName: string, elementName: string) => {
    try {
        const response = await api.get(`deepElement/node/${modelName}/${elementName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Node = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetNode(modelName: string, elementName: string): Node | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/node/${modelName}/${elementName}`))
// }

export const GetRelationship = async (modelName: string, elementName: string) => {
    try {
        const response = await api.get(`deepElement/relationship/${modelName}/${elementName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Relationship = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetRelationship(modelName: string, elementName: string): Relationship | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/relationship/${modelName}/${elementName}`))
// }

export const GetAssociation = async (modelName: string, elementName: string) => {
    try {
        const response = await api.get(`deepElement/association/${modelName}/${elementName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Association = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetAssociation(modelName: string, elementName: string): Association | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/association/${modelName}/${elementName}`))
// }

export const CreateNode = async (modelName: string, name: string, level: number, potency: number) => {
    try {
        const response = await api.post(`deepElement/node/create/${modelName}/${name}/${level}/${potency}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Node = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static CreateNode(modelName: string, name: string, level: number, potency: number): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/create/${modelName}/${name}/${level}/${potency}`))
// }

export const CreateGeneralization = async (modelName: string, name: string, sourceName: string, targetName: string, level: number, potency: number) => {
    try {
        const response = await api.post(`deepElement/generalization/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Generalization = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static CreateGeneralization(modelName: string, name: string, sourceName: string, targetName: string, level: number, potency: number): Generalization | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/generalization/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}`))
// }

export const CreateAssociations = async (modelName: string, name: string, sourceName: string, targetName: string, level: number, potency: number,
                                             minSource: number, maxSource: number, minTarget: number, maxTarget: number) => {
    try {
        const response = await api.post(`deepElement/association/create/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}/${minSource}/${maxSource}/${minTarget}/${maxTarget}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Node = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static CreateAssociations(modelName: string, name: string, sourceName: string, targetName: string,
//     level: number, potency: number,
//     minSource: number, maxSource: number, minTarget: number, maxTarget: number): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/create/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}/${minSource}/${maxSource}/${minTarget}/${maxTarget}`))
// }

export const InstantiateNode = async (modelName: string, name: string, parentModel: string, parentName: string) => {
    try {
        const response = await api.post(`deepElement/node/instantiate/${modelName}/${parentModel}/${parentName}/${name}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Node = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static InstantiateNode(modelName: string, name: string, parentModel: string, parentName: string): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/instantiate/${modelName}/${parentModel}/${parentName}/${name}`))
// }

export const InstantiateAssociation = async (modelName: string, name: string, parentModel: string, parentName: string, sourceName: string,
                                             targetName: string) => {
    try {
        const response = await api.post(`deepElement/association/instantiate/${modelName}/${name}/${parentModel}/${parentName}/${sourceName}/${targetName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Association = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static InstantiateAssociation(modelName: string, name: string, parentModel: string, parentName: string,
//     sourceName: string, targetName: string): Association | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/instantiate/${modelName}/${name}/${parentModel}/${parentName}/${sourceName}/${targetName}`))
// }

export const GetAttributes = async (modelName: string, name: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${name}/attributes`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Attribute[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetAttributes(modelName: string, name: string): Attribute[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/attributes`))
// }

export const GetAttribute = async (modelName: string, elementName: string, attributeName: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${elementName}/attribute/${attributeName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Attribute = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetAttribute(modelName: string, elementName: string, attributeName: string): Attribute | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}`))
// }

export const AddAttribute = async (modelName: string, elementName: string, attributeName: string, typeModel: string, typeName: string, level: number, potency: number) => {
    try {
        const response = await api.post(`deepElement/${modelName}/${elementName}/attribute/${attributeName}/${typeModel}/${typeName}/${level}/${potency}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Attribute = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static AddAttribute(modelName: string, elementName: string, attributeName: string, typeModel: string, typeName: string, level: number, potency: number): Attribute | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${typeModel}/${typeName}/${level}/${potency}`))
// }

export const SetAttributeSingle = async (modelName: string, elementName: string, attributeName: string, single: boolean) => {
    try {
        const response = await api.put(`deepElement/${modelName}/${elementName}/attribute/${attributeName}/${single}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Attribute = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static SetAttributeSingle(modelName: string, elementName: string, attributeName: string, single: boolean): Attribute | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${single}`))
// }

export const GetSlots = async (modelName: string, name: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${name}/slots`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Slot[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetSlots(modelName: string, name: string): Slot[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/slots`))
// }

export const GetSlot = async (modelName: string, elementName: string, attributeName: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${elementName}/slot/${attributeName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Slot = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetSlot(modelName: string, elementName: string, attributeName: string): Slot | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}`))
// }

export const AddSlot = async (modelName: string, elementName: string, attributeName: string, valueName: string, level: number, potency: number) => {
    try {
        const response = await api.post(`deepElement/${modelName}/${elementName}/slot/${attributeName}/${valueName}/${level}/${potency}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Slot = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static AddSlot(modelName: string, elementName: string, attributeName: string, valueName: string, level: number, potency: number): Slot | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}/${level}/${potency}`))
// }

export const SetSlotValue = async (modelName: string, elementName: string, attributeName: string, valueName: string) => {
    try {
        const response = await api.put(`deepElement/${modelName}/${elementName}/slot/${attributeName}/${valueName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Slot = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static SetSlotValue(modelName: string, elementName: string, attributeName: string, valueName: string): Slot | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}`))
// }

export const GetValuesForAttribute = async (modelName: string, elementName: string, attributeName: string) => {
    try {
        const response = await api.get(`deepElement/${modelName}/${elementName}/slot/${attributeName}/values`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetValuesForAttribute(modelName: string, elementName: string, attributeName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/values`))
// }
