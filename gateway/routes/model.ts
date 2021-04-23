import {Router} from 'express';
import axios from 'axios';

const modelRouter = Router();

modelRouter.get('/model/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get('http://localhost:8000/api/Repo/Model/' + modelName)
        .then(response => {
            res.send(response.data);
        });
});

modelRouter.get('/metamodel/:metamodelName', function (req, res) {
    const metamodelName = req.params.metamodelName;
    axios
        .get('http://localhost:8000/api/Repo/Model/' + metamodelName)
        .then(response => {
            res.send(response.data)
        });
});

export default modelRouter;