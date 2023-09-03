import EnvConfig from '../../configs/envConfig';
import { LogindexConfigs } from '../../configs/logindex';
import logger from '../../lib/logger';
import { getTimestamp, normalizeAddress } from '../../lib/utils';
import { IndexConfig } from '../../types/configs';
import { ContractLog } from '../../types/domain';
import { ContextServices, ILogIndexer } from '../../types/namespaces';
import { BlockAndTime, IndexOptions } from '../../types/options';

const QueryRange = 2000;

export class LogIndexer implements ILogIndexer {
  public readonly name: string = 'logindex';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  private getConfig(chain: string, address: string): IndexConfig | null {
    for (const config of LogindexConfigs) {
      if (config.chain === chain && config.address === address) {
        return config;
      }
    }

    return null;
  }

  private async transformLogs(
    chain: string,
    logs: Array<any>,
    blocktimes: { [key: number]: BlockAndTime },
  ): Promise<Array<ContractLog>> {
    const contractLogs: Array<ContractLog> = [];

    for (const log of logs) {
      const blockNumber = Number(log.blockNumber);
      let timestamp = 0;
      if (blocktimes[blockNumber]) {
        timestamp = blocktimes[blockNumber].timestamp;
      } else {
        timestamp = await this.services.web3.getBlockTime(chain, blockNumber);
      }

      contractLogs.push({
        chain,
        address: normalizeAddress(log.address),
        topics: log.topics,
        data: log.data,
        blockNumber,
        timestamp,
        transactionHash: log.transactionHash,
        logIndex: Number(log.logIndex),
      });
    }

    return contractLogs;
  }

  public async run(options: IndexOptions): Promise<void> {
    if (options.address) {
      await this.runSingleMode(options.chain, options.address, options.fromBlock);
    } else {
      await this.runNetworkMode(options.chain, options.fromBlock);
    }
  }

  private async runSingleMode(chain: string, address: string, fromBlock: number): Promise<void> {
    const config: IndexConfig | null = this.getConfig(chain, address);
    if (!config) {
      return;
    }

    const statesCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.states);
    const rawlogsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.rawlogs);

    let startBlock = config.birthBlock > fromBlock ? config.birthBlock : fromBlock;

    const stateKey = `log-index-contract-${chain}-${address}`;
    if (startBlock === 0) {
      const states: Array<any> = await statesCollection.find({ name: stateKey }).toArray();
      if (states.length > 0) {
        startBlock = Number(states[0].blockNumber) > startBlock ? Number(states[0].blockNumber) : startBlock;
      }
    }

    const web3 = this.services.web3.getProvider(chain);
    const latestBlock = Number(await web3.eth.getBlockNumber());

    logger.info('start indexer worker', {
      service: this.name,
      mode: 'single',
      chain,
      address,
      topics: config.topics.length,
      fromBlock: startBlock,
      toBlock: latestBlock,
    });

    while (startBlock <= latestBlock) {
      const startExeTime = getTimestamp();

      const toBlock = startBlock + QueryRange > latestBlock ? latestBlock : startBlock + QueryRange;

      let logs: Array<any> = [];
      for (const topic of config.topics) {
        logs = logs.concat(
          await web3.eth.getPastLogs({
            address: address,
            topics: [topic],
            fromBlock: startBlock,
            toBlock: toBlock,
          }),
        );
      }

      const blockTimes = await this.services.web3.getBlockTimes({
        chain,
        fromBlock: startBlock,
        numberOfBlocks: QueryRange,
      });
      const contractLogs: Array<ContractLog> = await this.transformLogs(chain, logs, blockTimes);

      const operations: Array<any> = [];
      for (const log of contractLogs) {
        operations.push({
          updateOne: {
            filter: {
              chain: chain,
              address: normalizeAddress(log.address),
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
            },
            update: {
              $set: {
                ...log,
              },
            },
            upsert: true,
          },
        });
      }
      if (operations.length > 0) {
        await rawlogsCollection.bulkWrite(operations);
      }

      // save state
      await statesCollection.updateOne(
        {
          name: stateKey,
        },
        {
          $set: {
            name: stateKey,
            blockNumber: toBlock,
          },
        },
        {
          upsert: true,
        },
      );

      const endExeTime = getTimestamp();
      const elapsed = Math.floor((endExeTime - startExeTime) / 1000);

      logger.info('indexed contract logs', {
        service: this.name,
        mode: 'single',
        chain,
        address,
        topics: config.topics.length,
        logs: operations.length,
        fromBlock: startBlock,
        toBlock: toBlock,
        elapsed: `${elapsed}s`,
      });

      startBlock += QueryRange;
    }
  }

  private async runNetworkMode(chain: string, fromBlock: number): Promise<void> {}
}
