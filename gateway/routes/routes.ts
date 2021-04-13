import { Router } from 'express';
import testRouter from './test';
import modelRouter from "./model";

const routes = Router();

routes.use('/test', testRouter);
routes.use('/model', modelRouter);

export default routes;