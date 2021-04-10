import { Router } from 'express';
import testRouter from './test';

const routes = Router();

routes.use('/test', testRouter);

export default routes;