import {Router} from 'express';
import axios from 'axios';

const modelRouter = Router();
const host = "localhost:8000"; // 'gateway:80'; // 'localhost:8000'

// Gets model
modelRouter.get('/model/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get(`http://${host}/api/Repo/Model/` + modelName)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

// Gets metamodel
modelRouter.get('/metamodel/:metamodelName', function (req, res) {
    const metamodelName = req.params.metamodelName;
    axios
        .get(`http://${host}/api/Repo/Model/` + metamodelName)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

export default modelRouter;