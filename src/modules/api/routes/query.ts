import { Router } from 'express';

// import LiquidityPools from '../../../configs/data/UniLiquidityPools.json';
import EnvConfig from '../../../configs/envConfig';
import { getTodayUTCTimestamp, normalizeAddress } from '../../../lib/utils';
import { ContextServices } from '../../../types/namespaces';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  // this query get latest snapshot for every unique lending market
  router.get('/lending/markets', async (request, response) => {
    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);
    const timestamp = getTodayUTCTimestamp();
    const latestSnapshots: Array<any> = await metricsCollection
      .find({
        metric: 'LendingMarketSnapshot',
        timestamp: timestamp,
      })
      .toArray();

    const markets: Array<any> = [];
    for (const market of latestSnapshots) {
      delete market._id;
      markets.push(market);
    }

    response
      .status(200)
      .json({
        markets: markets,
      })
      .end();
  });

  // this query return all available market metadata for a protocol
  router.get('/lending/protocol/:protocol/markets', async (request, response) => {
    const protocol: string = request.params.protocol;

    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);
    const uniqueMarkets: Array<any> = await metricsCollection
      .aggregate([
        {
          $group: {
            _id: {
              protocol: '$protocol',
              token: '$token',
            },
          },
        },
        {
          $match: {
            '_id.protocol': protocol,
          },
        },
      ])
      .toArray();

    const markets: Array<any> = [];
    for (const market of uniqueMarkets) {
      markets.push({
        ...market._id,
      });
    }

    response
      .status(200)
      .json({
        protocol: protocol,
        markets: markets,
      })
      .end();
  });

  // this endpoint return fully snapshots for a unique lending market
  router.get('/lending/protocol/:protocol/chain/:chain/token/:token', async (request, response) => {
    const protocol: string = request.params.protocol;
    const chain: string = request.params.chain;
    const token: string = request.params.token;

    const order =
      request.query.order && (request.query.order === 'oldest' || request.query.order === 'latest')
        ? request.query.order
        : 'latest';

    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);
    const snapshots: Array<any> = await metricsCollection
      .find({
        protocol,
        chain,
        'token.address': normalizeAddress(token),
      })
      .sort({
        timestamp: order === 'oldest' ? 1 : -1,
      })
      .toArray();

    const returnData: Array<any> = [];
    for (const snapshot of snapshots) {
      delete snapshot._id;
      returnData.push(snapshot);
    }

    response
      .status(200)
      .json({
        protocol,
        chain,
        token: normalizeAddress(token),
        snapshots: returnData,
      })
      .end();
  });

  // this endpoint return fully snapshots for a unique liquidity pool
  router.get('/liquidity/protocol/:protocol/chain/:chain/pool/:pool', async (request, response) => {
    const protocol: string = request.params.protocol;
    const chain: string = request.params.chain;
    const pool: string = request.params.pool;

    const order =
      request.query.order && (request.query.order === 'oldest' || request.query.order === 'latest')
        ? request.query.order
        : 'latest';

    const metricsCollection = await services.mongo.getCollection(EnvConfig.mongo.collections.metrics);
    const snapshots: Array<any> = await metricsCollection
      .find({
        metric: 'LiquidityPoolSnapshot',
        protocol,
        chain,
        address: normalizeAddress(pool),
      })
      .sort({
        timestamp: order === 'oldest' ? 1 : -1,
      })
      .toArray();

    const returnData: Array<any> = [];
    for (const snapshot of snapshots) {
      delete snapshot._id;
      returnData.push(snapshot);
    }

    response
      .status(200)
      .json({
        protocol,
        chain,
        pool: normalizeAddress(pool),
        snapshots: returnData,
      })
      .end();
  });

  return router;
}
