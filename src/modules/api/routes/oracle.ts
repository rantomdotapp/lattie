import { HttpStatusCode } from 'axios';
import { Router } from 'express';

import { getStartDayTimestamp, getTodayUTCTimestamp } from '../../../lib/utils';
import { ContextServices } from '../../../types/namespaces';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  // get token spot price
  router.get('/spot/:chain/:token', async (request, response) => {
    let timestamp = request.query.timestamp
      ? getStartDayTimestamp(Number(request.query.timestmap))
      : getTodayUTCTimestamp();

    const spotPrice = await services.oracle.getTokenPriceUSD(request.params.chain, request.params.token, timestamp);

    writeResponse(request, response, HttpStatusCode.Ok, {
      chain: request.params.chain,
      token: request.params.token,
      timestamp: timestamp,
      spotPriceUSD: spotPrice,
    });
  });

  return router;
}
