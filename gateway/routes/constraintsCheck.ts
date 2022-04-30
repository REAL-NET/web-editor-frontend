import {Router} from 'express';
import axios from 'axios';
import {host} from "./host";

const constraintsCheckRouter = Router();

// Gets the result of query strategy check
constraintsCheckRouter.get(`/queryCheck/:modelName`, function (req, res) {
    let modelName = req.params.modelName;
    axios
        .get(`${host}/ConstraintsCheck/queryCheck/${modelName}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send([]);
        });
});

export default constraintsCheckRouter;