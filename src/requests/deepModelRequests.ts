import api from './api'
import {ModelInfo} from "../model/ModelInfo";
import {Model} from "../model/Model";
import {ElementInfo} from "../model/ElementInfo";

export const AllModels = async() => {
    try {
        const response = await api.get(`deepModel/all`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ModelInfo[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
}
// public static AllModels(): ModelInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/all`));
// }

export const GetModel = async (modelName: string) => {
    try {
        const response = await api.get(`deepModel/${modelName}`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: Model= response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetModel(modelName: string): Model | undefined {
//     let result: Model | undefined = this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}`));
//     console.debug(result);
//     return result;
// }

export const GetModelMetaNodes = async (modelName: string) => {
    try {
        const response = await api.get(`deepModel/${modelName}/metanodes`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetModelMetaNodes(modelName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metanodes`));
// }

export const GetModelMetaEdges = async (modelName: string) => {
    try {
        const response = await api.get(`deepModel/${modelName}/metaedges`);
        if (response.data === undefined) {
            return undefined;
        }
        const responseParsed: ElementInfo[] = response.data;
        return responseParsed;
    } catch (error) {
        console.log(error);
    }
};
// public static GetModelMetaEdges(modelName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metaedges`));
// }

export const DeleteModel = async (modelName: string) => {
    try {
        await api.delete(`deepModel/${modelName}`);
    } catch (error) {
        console.log(error);
    }
};
// public static DeleteModel(modelName: string) {
//     Requests.Request("DELETE", `${RepoAPI.host}/Model/${modelName}`)
// }

export const CreateDeepMetamodel = async (modelName: string) => {
    try {
        const response = await api.post(`deepModel/model/${modelName}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
// public static CreateDeepMetamodel(modelName: string) {
//     return Requests.Request("POST", `${RepoAPI.host}/Model/${modelName}`)
// }

export const CreateModel = async (metamodelName: string, modelName: string) => {
    try {
        const response = await api.post(`deepModel/${metamodelName}/${modelName}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
// public static CreateModel(metamodelName: string, modelName: string) {
//     return Requests.Request("POST", `${RepoAPI.host}/Model/${metamodelName}/${modelName}`)
// }

export const RenameModel = async (oldName: string, newName: string) => {
    try {
        const response = await api.put(`deepModel/${oldName}/name/${newName}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
// public static RenameModel(oldName: string, newName: string) {
//     return Requests.Request("PUT", `${RepoAPI.host}/Model/${oldName}/name/${newName}`)
// }
