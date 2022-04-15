import {Router} from 'express';
import axios from 'axios';
import {host} from "./host";

const modelRouter = Router();

// Gets model
modelRouter.get('/model/:modelName', function (req, res) {
    const modelName = req.params.modelName;
    axios
        .get(`${host}/Model/` + modelName)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

export default modelRouter;