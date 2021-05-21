import {Router} from 'express';
import axios from 'axios';

const attributeRouter = Router();
const host = 'localhost:8000'; // 'gateway:80'; // 'localhost:8000'

// Gets the attribute value
attributeRouter.get(`/:modelName/:id/:attribute`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    let attribute = req.params.attribute;
    axios
        .get(`http://${host}/api/Repo/Attribute/${modelName}/${id}/${attribute}`)
        .then(response => {
            res.send(`${response.data}`);
        })
        .catch(error => {
            console.log(error.message);
            res.send(undefined);
        });
});

// Adds the attribute into element
attributeRouter.post(`/:modelName/:id/:attribute/:defaultValue`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    let attribute = req.params.attribute;
    let defaultValue = req.params.defaultValue;
    axios
        .post(`http://${host}/api/Repo/Attribute/${modelName}/${id}/${attribute}/0/${defaultValue}`)
        .then(response => {
            res.send(`${response.status}`)
        })
        .catch(error => {
            console.log(error.message);
        });
});

// Changes the attribute value
attributeRouter.put(`/:modelName/:id/:attribute/:value`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    let attribute = req.params.attribute;
    let value = req.params.value;
    axios
        .put(`http://${host}/api/Repo/Attribute/${modelName}/${id}/${attribute}/value/${value}`)
        .then(response => {
            res.send(`${response.status}`)
        })
        .catch(error => {
            console.log(error.message);
        });
});

export default attributeRouter;