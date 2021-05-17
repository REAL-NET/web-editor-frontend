import {Router} from 'express';
import axios from 'axios';

const modelRouter = Router();
const host = 'gateway:80'; // 'localhost:8000'

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

modelRouter.get('/metamodel/:metamodelName', function (req, res) {
    const metamodelName = req.params.metamodelName;
    console.log('get metamodel gateway here sent');
    axios
        .get(`http://${host}/api/Repo/Model/` + metamodelName)
        .then(response => {
            console.log('get metamodel gateway here received');
            res.send(response.data);
        })
        .catch(error => {
            console.log('get metamodel gateway ERROR here');
            console.log(error.message);
            res.send([]);
        });
});

export default modelRouter;