import {Router} from 'express';
import axios from 'axios';

const elementRouter = Router();
const host = 'localhost:8000'; // 'gateway:80'; // 'localhost:8000'

// Gets node
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

// Gets edge
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

export default elementRouter;