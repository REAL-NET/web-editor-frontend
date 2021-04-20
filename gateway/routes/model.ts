import { Router } from 'express';
import axios from 'axios';

const modelRouter = Router();
const model = 'AirSimModel';
const metamodel = 'AirSimMetamodel';

modelRouter.get('/model', function (req, res, next) {
    axios
        .get('http://localhost:8000/api/Repo/Model/' + model)
        .then(response => {
            // metamodel = response.data.metamodelName;
            res.send(response.data);
        });
});

modelRouter.get('/metamodel', function (req, res, next) {
    axios
        .get('http://localhost:8000/api/Repo/Model/' + metamodel)
        .then(response => {
            res.send(response.data)
        });
});

export default modelRouter;