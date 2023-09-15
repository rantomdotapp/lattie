import { Router } from 'express';

import { ContextServices } from '../../types/namespaces';
import { middleware } from './middleware';
import * as queryRouter from './routes/query';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.use('/', middleware);

  router.use('/query', queryRouter.getRouter(services));

  return router;
}

export default getRouter;
