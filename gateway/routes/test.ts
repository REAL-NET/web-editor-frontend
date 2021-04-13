import { Router } from 'express';
import axios from 'axios';

const testRouter =  Router();

testRouter.get('/', function(req, res, next) {
    axios
        .get('http://localhost:8000/api/Repo/Model/all')
        .then(response => res.send(response.data));
});

export default testRouter;