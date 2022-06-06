import {Router} from 'express';
import axios from 'axios';
import {host} from "./host";

const elementRouter = Router();

// Gets the node
elementRouter.get(`/:modelName/node/:id`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .get(`${host}/Element/${modelName}/${id}/asNode`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

// Gets the edge
elementRouter.get('/:modelName/edge/:id', function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .get(`${host}/Element/${modelName}/${id}/asEdge`)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

// Changes the name of the element
elementRouter.put('/:modelName/:id/name/:value', function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    let value = req.params.value;
    axios
        .put(`${host}/Element/${modelName}/${id}/name/${value}`)
        .then(response => {
            res.send(`${response.status}`)
        })
        .catch(error => {
            console.log(error.message);
        });
});

// Adds new element by its parent's id in metamodel
elementRouter.post('/:modelName/:id', function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .post(`${host}/Element/${modelName}/${id}`)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});

// Changes edge's from element
elementRouter.put('/:modelName/:edgeId/from/:elementId', function (req, res) {
    let modelName = req.params.modelName;
    let edgeId = req.params.edgeId;
    let elementId = req.params.elementId;
    axios
        .put(`${host}/Element/${modelName}/${edgeId}/from/${elementId}`)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});

// Changes edge's to element
elementRouter.put('/:modelName/:edgeId/to/:elementId', function (req, res) {
    let modelName = req.params.modelName;
    let edgeId = req.params.edgeId;
    let elementId = req.params.elementId;
    axios
        .put(`${host}/Element/${modelName}/${edgeId}/to/${elementId}`)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});

// Deletes the element
elementRouter.delete('/:modelName/:id', function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .delete(`${host}/Element/${modelName}/${id}`)
        .then(response => {
            res.send(`${response.status}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});

export default elementRouter;