import {Router} from 'express';
import axios from 'axios';

const modelRouter = Router();

modelRouter.get('/model/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get('http://localhost:8000/api/Repo/Model/' + modelName)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

modelRouter.get('/metamodel/:metamodelName', function (req, res) {
    const metamodelName = req.params.metamodelName;
    axios
        .get('http://localhost:8000/api/Repo/Model/' + metamodelName)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

export default modelRouter;