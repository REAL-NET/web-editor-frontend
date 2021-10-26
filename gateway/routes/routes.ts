import { Router } from 'express';
import attributeRouter from './attribute';
import elementRouter from './element';
import modelRouter from './model';
import deepModelRouter from "./deepModel";
import deepElementRouter from "./deepElement";

const routes = Router();

routes.use('/attribute', attributeRouter);
routes.use('/element', elementRouter);
routes.use('/model', modelRouter);
routes.use('/deepElement', deepElementRouter);
routes.use('/deepModel', deepModelRouter);

export default routes;