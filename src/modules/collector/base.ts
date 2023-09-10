import { GenesisTimes } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { getStartDayTimestamp, getTimestamp, getTodayUTCTimestamp } from '../../lib/utils';
import { LendingMarketConfig } from '../../types/configs';
import { DataMetric } from '../../types/domain';
import { ContextServices, ICollector } from '../../types/namespaces';
import { CollectorOptions } from '../../types/options';

export class BaseCollector implements ICollector {
  public readonly name: string = 'base';
  public readonly services: ContextServices;
  public readonly metric: DataMetric;
  public readonly fromTime: number;
  public readonly config: LendingMarketConfig;

  constructor(services: ContextServices, options: CollectorOptions) {
    this.services = services;
    this.metric = options.metric;
    this.config = options.config;
    this.fromTime = options.fromTime;
  }

  public async getSnapshot(timestamp: number): Promise<Array<any> | null> {
    return null;
  }

  public async run(): Promise<void> {
    const statesCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.states);
    const metricsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.metrics);

    let startTime = 0;

    // we find last sync timestamp from database
    const stateKey: string = `snapshot-contract-${this.metric}-${this.config.chain}-${this.config.address}`;
    const states: Array<any> = await statesCollection
      .find({
        name: stateKey,
      })
      .toArray();
    if (states.length > 0) {
      startTime = states[0].timestamp;
    }

    if (startTime === 0) {
      // we get timestamp of contract birth block
      const block = await this.services.web3.getProvider(this.config.chain).eth.getBlock(this.config.birthBlock);
      if (block) {
        // we start from the next day
        startTime = getStartDayTimestamp(Number(block.timestamp)) + 24 * 60 * 60;
      }
    }

    if (GenesisTimes[this.metric] && GenesisTimes[this.metric] > startTime) {
      startTime = GenesisTimes[this.metric];
    }

    if (startTime < this.fromTime) {
      startTime = getStartDayTimestamp(this.fromTime);
    }

    const today = getTodayUTCTimestamp();

    logger.info('start collect data snapshot', {
      service: this.name,
      metric: this.metric,
      protocol: this.config.protocol,
      chain: this.config.chain,
      address: this.config.address,
      token: this.config.token.symbol,
      from: new Date(startTime * 1000).toISOString().split('T')[0],
      to: new Date(today * 1000).toISOString().split('T')[0],
    });

    while (startTime <= today) {
      const startExeTime = getTimestamp();
      const snapshots: Array<any> | null = await this.getSnapshot(startTime);

      if (snapshots) {
        for (const snapshot of snapshots) {
          await metricsCollection.updateOne(
            {
              metric: this.metric,
              protocol: snapshot.protocol,
              chain: snapshot.chain,
              timestamp: snapshot.timestamp,
              address: snapshot.address,
            },
            {
              $set: {
                ...snapshot,
              },
            },
            {
              upsert: true,
            },
          );
        }
      }

      await statesCollection.updateOne(
        {
          name: stateKey,
        },
        {
          $set: {
            name: stateKey,
            timestamp: startTime,
          },
        },
        {
          upsert: true,
        },
      );

      const endExeTime = getTimestamp();
      const elapsed = endExeTime - startExeTime;

      logger.info('collected data snapshot', {
        service: this.name,
        metric: this.metric,
        protocol: this.config.protocol,
        chain: this.config.chain,
        address: this.config.address,
        token: this.config.token.symbol,
        date: new Date(startTime * 1000).toISOString().split('T')[0],
        elapsed: `${Math.floor(elapsed / 1000)}ms`,
      });

      startTime += 24 * 60 * 60;
    }
  }
}
