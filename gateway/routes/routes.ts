import { Router } from 'express';
import attributeRouter from './attribute';
import elementRouter from './element';
import modelRouter from './model';

const routes = Router();

routes.use('/attribute', attributeRouter);
routes.use('/element', elementRouter);
routes.use('/model', modelRouter);

export default routes;