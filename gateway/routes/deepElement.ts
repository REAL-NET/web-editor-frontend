import {Router} from 'express';
import axios from 'axios';
import {host} from "./host";

const deepElementRouter = Router();

// Gets element
deepElementRouter.get(`/:modelName/:elementName`, function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    axios
        .get(`${host}/Element/${modelName}/${elementName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static GetElement(modelName: string, elementName: string): Element | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}`))
// }

// Sets element name
deepElementRouter.put('/:modelName/:oldName/name/:newName', function (req, res) {
    let modelName = req.params.modelName;
    let oldName = req.params.oldName;
    let newName = req.params.newName;
    axios
        .put(`${host}/Element/${modelName}/${oldName}/name/${newName}`)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});
// public static SetElementName(modelName: string, oldName: string, newName: string): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/name/${newName}`));
// }

// Sets element level
deepElementRouter.put('/:modelName/:oldName/level/:level', function (req, res) {
    let modelName = req.params.modelName;
    let oldName = req.params.oldName;
    let level = req.params.level;
    axios
        .put(`${host}/Element/${modelName}/${oldName}/level/${level}`)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static SetElementLevel(modelName: string, oldName: string, level: number): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/level/${level}`));
// }

// Sets element potency
deepElementRouter.put('/:modelName/:oldName/potency/:potency', function (req, res) {
    let modelName = req.params.modelName;
    let oldName = req.params.oldName;
    let potency = req.params.potency;
    axios
        .put(`${host}/Element/${modelName}/${oldName}/potency/${potency}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static SetElementPotency(modelName: string, oldName: string, potency: number): ElementInfo | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${oldName}/potency/${potency}`));
// }

// Deletes element
deepElementRouter.delete('/:modelName/:elementName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    axios
        .delete(`${host}/Element/${modelName}/${elementName}`)
        .then(response => {
            res.send(`${response.status}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static DeleteElement(modelName: string, elementName: string) {
//     Requests.Request("DELETE", `${RepoAPI.host}/Element/${modelName}/${elementName}`)
// }

// Gets node
deepElementRouter.get('/node/:modelName/:elementName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    axios
        .get(`${host}/Element/node/${modelName}/${elementName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetNode(modelName: string, elementName: string): Node | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/node/${modelName}/${elementName}`))
// }

// Gets relationship
deepElementRouter.get('/relationship/:modelName/:elementName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    axios
        .get(`${host}/Element/relationship/${modelName}/${elementName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetRelationship(modelName: string, elementName: string): Relationship | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/relationship/${modelName}/${elementName}`))
// }

// Gets association
deepElementRouter.get('/association/:modelName/:elementName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    axios
        .get(`${host}/Element/association/${modelName}/${elementName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetAssociation(modelName: string, elementName: string): Association | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/association/${modelName}/${elementName}`))
// }

// Creates node
deepElementRouter.post('/node/create/:modelName/:name/:level/:potency', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    let level = req.params.level;
    let potency = req.params.potency;
    axios
        .post(`${host}/Element/node/create/${modelName}/${name}/${level}/${potency}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static CreateNode(modelName: string, name: string, level: number, potency: number): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/create/${modelName}/${name}/${level}/${potency}`))
// }

// Creates generalization
deepElementRouter.post('/generalization/:modelName/:name/:sourceName/:targetName/:level/:potency', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    let sourceName = req.params.sourceName;
    let targetName = req.params.targetName;
    let level = req.params.level;
    let potency = req.params.potency;
    axios
        .post(`${host}/Element/generalization/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static CreateGeneralization(modelName: string, name: string, sourceName: string, targetName: string, level: number, potency: number): Generalization | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/generalization/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}`))
// }

// Creates associations
deepElementRouter.post('/association/create/:modelName/:name/:sourceName/:targetName/:level/:potency/:minSource/:maxSource/:minTarget/:maxTarget', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    let sourceName = req.params.sourceName;
    let targetName = req.params.targetName;
    let level = req.params.level;
    let potency = req.params.potency;
    let minSource = req.params.minSource;
    let maxSource = req.params.maxSource;
    let minTarget = req.params.minTarget;
    let maxTarget = req.params.maxTarget;
    axios
        .post(`${host}/Element/association/create/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}/${minSource}/${maxSource}/${minTarget}/${maxTarget}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static CreateAssociations(modelName: string, name: string, sourceName: string, targetName: string,
//     level: number, potency: number,
//     minSource: number, maxSource: number, minTarget: number, maxTarget: number): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/create/${modelName}/${name}/${sourceName}/${targetName}/${level}/${potency}/${minSource}/${maxSource}/${minTarget}/${maxTarget}`))
// }

// Instantiates node
deepElementRouter.post('/node/instantiate/:modelName/:parentModel/:parentName/:name', function (req, res) {
    let modelName = req.params.modelName;
    let parentModel = req.params.parentModel;
    let parentName = req.params.parentName;
    let name = req.params.name;
    axios
        .post(`${host}/Element/node/instantiate/${modelName}/${parentModel}/${parentName}/${name}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static InstantiateNode(modelName: string, name: string, parentModel: string, parentName: string): Node | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/node/instantiate/${modelName}/${parentModel}/${parentName}/${name}`))
// }

// Instantiates association
deepElementRouter.post('/association/instantiate/:modelName/:name/:parentModel/:parentName/:sourceName/:targetName', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    let parentModel = req.params.parentModel;
    let parentName = req.params.parentName;
    let sourceName = req.params.sourceName;
    let targetName = req.params.targetName;
    axios
        .post(`${host}/Element/association/instantiate/${modelName}/${name}/${parentModel}/${parentName}/${sourceName}/${targetName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static InstantiateAssociation(modelName: string, name: string, parentModel: string, parentName: string,
//     sourceName: string, targetName: string): Association | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/association/instantiate/${modelName}/${name}/${parentModel}/${parentName}/${sourceName}/${targetName}`))
// }

// Gets attributes
deepElementRouter.get('/:modelName/:name/attributes', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    axios
        .get(`${host}/Element/${modelName}/${name}/attributes`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetAttributes(modelName: string, name: string): Attribute[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/attributes`))
// }

// Gets attribute
deepElementRouter.get('/:modelName/:elementName/attribute/:attributeName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    axios
        .get(`${host}/Element/${modelName}/${elementName}/attribute/${attributeName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetAttribute(modelName: string, elementName: string, attributeName: string): Attribute | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}`))
// }

// Adds attribute
deepElementRouter.post('/:modelName/:elementName/attribute/:attributeName/:typeModel/:typeName/:level/:potency', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    let typeModel = req.params.typeModel;
    let typeName = req.params.typeName;
    let level = req.params.level;
    let potency = req.params.potency;
    axios
        .post(`${host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${typeModel}/${typeName}/${level}/${potency}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static AddAttribute(modelName: string, elementName: string, attributeName: string, typeModel: string, typeName: string, level: number, potency: number): Attribute | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${typeModel}/${typeName}/${level}/${potency}`))
// }

// Sets attribute single
deepElementRouter.put('/:modelName/:elementName/attribute/:attributeName/:single', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    let single = req.params.single;
    axios
        .put(`${host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${single}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static SetAttributeSingle(modelName: string, elementName: string, attributeName: string, single: boolean): Attribute | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/attribute/${attributeName}/${single}`))
// }

// Gets slots
deepElementRouter.get('/:modelName/:name/slots', function (req, res) {
    let modelName = req.params.modelName;
    let name = req.params.name;
    axios
        .get(`${host}/Element/${modelName}/${name}/slots`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetSlots(modelName: string, name: string): Slot[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${name}/slots`))
// }

// Gets slot
deepElementRouter.get('/:modelName/:elementName/slot/:attributeName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    axios
        .get(`${host}/Element/${modelName}/${elementName}/slot/${attributeName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetSlot(modelName: string, elementName: string, attributeName: string): Slot | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}`))
// }

// Adds slot
deepElementRouter.post('/:modelName/:elementName/slot/:attributeName/:valueName/:level/:potency', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    let valueName = req.params.valueName;
    let level = req.params.level;
    let potency = req.params.potency;
    axios
        .post(`${host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}/${level}/${potency}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static AddSlot(modelName: string, elementName: string, attributeName: string, valueName: string, level: number, potency: number): Slot | undefined {
//     return this.ParseJson(Requests.Request("POST", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}/${level}/${potency}`))
// }

// Sets slot value
deepElementRouter.put('/:modelName/:elementName/slot/:attributeName/:valueName', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    let valueName = req.params.valueName;
    axios
        .put(`${host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static SetSlotValue(modelName: string, elementName: string, attributeName: string, valueName: string): Slot | undefined {
//     return this.ParseJson(Requests.Request("PUT", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/${valueName}`))
// }

// Gets values for attribute
deepElementRouter.get('/:modelName/:elementName/slot/:attributeName/values', function (req, res) {
    let modelName = req.params.modelName;
    let elementName = req.params.elementName;
    let attributeName = req.params.attributeName;
    axios
        .get(`${host}/Element/${modelName}/${elementName}/slot/${attributeName}/values`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
// public static GetValuesForAttribute(modelName: string, elementName: string, attributeName: string): ElementInfo[] | undefined {
//     return this.ParseJson(Requests.Request("GET", `${RepoAPI.host}/Element/${modelName}/${elementName}/slot/${attributeName}/values`))
// }

export default deepElementRouter;
