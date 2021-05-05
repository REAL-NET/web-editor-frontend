import {Router} from 'express';
import axios from 'axios';

const elementRouter = Router();

elementRouter.get(`/:modelName/node/:id`, function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .get(`http://localhost:8000/api/Repo/Element/${modelName}/${id}/asNode`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

elementRouter.get('/:modelName/edge/:id', function (req, res) {
    let modelName = req.params.modelName;
    let id = req.params.id;
    axios
        .get(`http://localhost:8000/api/Repo/Element/${modelName}/${id}/asEdge`)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

export default elementRouter;