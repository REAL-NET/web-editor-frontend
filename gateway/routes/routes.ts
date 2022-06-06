import { Router } from 'express';
import attributeRouter from './attribute';
import elementRouter from './element';
import modelRouter from './model';
import constraintsCheckRouter from './constraintsCheck';

const routes = Router();

routes.use('/attribute', attributeRouter);
routes.use('/element', elementRouter);
routes.use('/model', modelRouter);
routes.use('/constraintsCheck', constraintsCheckRouter);

export default routes;