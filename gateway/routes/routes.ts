import { Router } from 'express';
import modelRouter from './model';
import elementRouter from './element';

const routes = Router();

routes.use('/element', elementRouter);
routes.use('/model', modelRouter);

export default routes;