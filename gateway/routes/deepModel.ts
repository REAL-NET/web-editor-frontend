import {Router} from 'express';
import axios from 'axios';
import {host} from "./host";

const deepModelRouter = Router();

// Gets list with all models
deepModelRouter.get('/all', function (req, res) {
    axios
        .get(`${host}/Model/all`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static AllModels(): ModelInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/all`));
// }
//

// Gets model
deepModelRouter.get('/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get(`${host}/Model/` + modelName)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static GetModel(modelName: string): Model | undefined {
//     let result: Model | undefined = this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}`));
//     console.debug(result);
//     return result;
// }

// Gets model meta nodes
deepModelRouter.get('/:modelName/metanodes', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get(`${host}/Model/` + modelName + `/metanodes`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static GetModelMetaNodes(modelName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metanodes`));
// }

// Gets model meta edges
deepModelRouter.get('/:modelName/metaedges', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get(`${host}/Model/` + modelName+ `/metaedges`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static GetModelMetaEdges(modelName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Model/${modelName}/metaedges`));
// }

// Deletes model
deepModelRouter.delete('/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .delete(`${host}/Model/` + modelName)
        .then(response => {
            res.send(`${response.status}`);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static DeleteModel(modelName: string) {
//     Requests.Request("DELETE", `${RepoAPI.host}/Model/${modelName}`)
// }

// Creates deep metamodel
deepModelRouter.post('/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .post(`${host}/Model/` + modelName)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static CreateDeepMetamodel(modelName: string) {
//     return Requests.Request("POST", `${RepoAPI.host}/Model/${modelName}`)
// }

// Creates model
deepModelRouter.post('/:metamodelName/:modelName', function (req, res) {
    const metamodelName = req.params.metamodelName;
    const modelName = req.params.modelName;
    axios
        .post(`${host}/Model/` + metamodelName + `/` + modelName)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static CreateModel(metamodelName: string, modelName: string) {
//     return Requests.Request("POST", `${RepoAPI.host}/Model/${metamodelName}/${modelName}`)
// }

// Renames model
deepModelRouter.put('/:oldName/name/:newName', function (req, res) {
    const oldName = req.params.oldName;
    const newName = req.params.newName;
    axios
        .put(`${host}/Model/` + oldName + `/name/` + newName)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static RenameModel(oldName: string, newName: string) {
//     return Requests.Request("PUT", `${RepoAPI.host}/Model/${oldName}/name/${newName}`)
// }


export default deepModelRouter;
