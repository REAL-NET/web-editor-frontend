import {Requests} from "./Requests";
import {ModelInfo} from "../model/ModelInfo";
import {Model} from "../model/Model";

export class RepoAPI {
    static host: string = "http://localhost:8000/api/repo"


    // Models

    public static AllModels(): ModelInfo[] | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/all`));
    }

    public static GetModel(modelName: string): Model | undefined {
        return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}`));
    }

    public static DeleteModel(modelName: string) {
        Requests.Request("DETELE", "${RepoAPI.host}/Model/${modelName}")
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

    private static ParseJson<Type>(json: string | undefined): Type | undefined {
        if (json === undefined) {
            return undefined;
        }
        return JSON.parse(json)
    }
    


}