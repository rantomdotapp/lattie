import { HttpStatusCode } from 'axios';
import { Router } from 'express';

import EnvConfig from '../../../configs/envConfig';
import { LendingMarketConfigs } from '../../../configs/lending';
import { getTodayUTCTimestamp, normalizeAddress } from '../../../lib/utils';
import { ContextServices } from '../../../types/namespaces';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  // query all available lending markets
  router.get('/lending/markets', async (request, response) => {
    writeResponse(request, response, HttpStatusCode.Ok, {
      error: null,
      markets: LendingMarketConfigs,
    });
  });

  // query latest snapshot of all available market
  router.get('/lending/snapshots', async (request, response) => {
    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);
    const timestamp = getTodayUTCTimestamp();

    const documents: Array<any> = await metricsCollection
      .find({
        timestamp: timestamp,
        metric: 'lending',
      })
      .toArray();

    const snapshots: Array<any> = [];
    for (const market of documents) {
      delete market._id;
      snapshots.push(market);
    }

    writeResponse(request, response, HttpStatusCode.Ok, {
      error: null,
      snapshots: snapshots,
    });
  });

  // query all snapshot of a specify market
  router.get('/lending/snapshots/:protocol/:chain/:address/:token', async (request, response) => {
    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);

    const documents: Array<any> = await metricsCollection
      .find({
        protocol: request.params.protocol,
        chain: request.params.chain,
        address: normalizeAddress(request.params.address),
        'token.address': normalizeAddress(request.params.token),
        metric: 'lending',
      })
      .sort({ timestamp: -1 })
      .toArray();

    const snapshots: Array<any> = [];
    for (const market of documents) {
      delete market._id;
      snapshots.push(market);
    }

    writeResponse(request, response, HttpStatusCode.Ok, {
      error: null,
      snapshots: snapshots,
    });
  });

  return router;
}
