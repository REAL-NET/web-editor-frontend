import {Router} from 'express';
import axios from 'axios';

const elementRouter = Router();
const host = 'localhost:8000'; // 'gateway:80'; // 'localhost:8000'

// Gets the node
elementRouter.get(`/:modelName/node/:id`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .get(`http://${host}/api/Repo/Element/${modelName}/${id}/asNode`)
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
        .get(`http://${host}/api/Repo/Element/${modelName}/${id}/asEdge`)
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
        .put(`http://${host}/api/Repo/Element/${modelName}/${id}/name/${value}`)
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
        .post(`http://${host}/api/Repo/Element/${modelName}/${id}`)
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
        .delete(`http://${host}/api/Repo/Element/${modelName}/${id}`)
        .then(response => {
            res.send(`${response.status}`);
        })
        .catch(error => {
            console.log(error.message);
        });
});

export default elementRouter;