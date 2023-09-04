import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { getTimestamp, normalizeAddress } from '../../lib/utils';
import { IndexConfig } from '../../types/configs';
import { ContractLog } from '../../types/domain';
import { ContextServices, ILogIndexer } from '../../types/namespaces';
import { BlockAndTime, IndexOptions } from '../../types/options';

const SingleModeQueryRange = 2000;

export class LogIndexer implements ILogIndexer {
  public readonly name: string = 'logindex';
  public readonly configs: Array<IndexConfig>;
  public readonly services: ContextServices;

  constructor(services: ContextServices, configs: Array<IndexConfig>) {
    this.services = services;
    this.configs = configs;
  }

  private getConfig(chain: string, address: string): IndexConfig | null {
    for (const config of this.configs) {
      if (config.chain === chain && config.address === address) {
        return config;
      }
    }

    return null;
  }

  private async saveLogs(chain: string, logs: Array<ContractLog>) {
    const rawlogsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.rawlogs);

    const operations: Array<any> = [];
    for (const log of logs) {
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
  }

  private async saveState(name: string, blockNumber: number) {
    const statesCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.states);
    await statesCollection.updateOne(
      {
        name: name,
      },
      {
        $set: {
          name: name,
          blockNumber: blockNumber,
        },
      },
      {
        upsert: true,
      },
    );
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
    let configs: Array<IndexConfig> = [];
    if (options.address) {
      configs = this.configs.filter((item) => item.chain === options.chain && item.address === options.address);
    } else {
      configs = this.configs.filter((item) => item.chain === options.chain);
    }

    for (const config of configs) {
      await this.runSingleMode(options.chain, config.address, options.fromBlock);
    }
  }

  private async runSingleMode(chain: string, address: string, fromBlock: number): Promise<void> {
    const config: IndexConfig | null = this.getConfig(chain, address);
    if (!config) {
      return;
    }

    const statesCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.states);

    let startBlock = config.birthBlock > fromBlock ? config.birthBlock : fromBlock;

    const stateKey = `log-index-contract-${chain}-${address}`;
    const states: Array<any> = await statesCollection.find({ name: stateKey }).toArray();
    if (states.length > 0) {
      startBlock = Number(states[0].blockNumber) > startBlock ? Number(states[0].blockNumber) : startBlock;
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

      const toBlock = startBlock + SingleModeQueryRange > latestBlock ? latestBlock : startBlock + SingleModeQueryRange;

      let logs: Array<any> = [];
      for (const topics of config.topics) {
        logs = logs.concat(
          await web3.eth.getPastLogs({
            address: address,
            topics: topics,
            fromBlock: startBlock,
            toBlock: toBlock,
          }),
        );
      }

      const blockTimes = await this.services.web3.getBlockTimes({
        chain,
        fromBlock: startBlock,
        numberOfBlocks: SingleModeQueryRange,
      });
      const contractLogs: Array<ContractLog> = await this.transformLogs(chain, logs, blockTimes);

      await this.saveLogs(chain, contractLogs);
      await this.saveState(stateKey, toBlock);

      const endExeTime = getTimestamp();
      const elapsed = endExeTime - startExeTime;

      logger.info('indexed contract logs', {
        service: this.name,
        mode: 'single',
        chain,
        address,
        topics: config.topics.length,
        logs: contractLogs.length,
        fromBlock: startBlock,
        toBlock: toBlock,
        elapsed: `${elapsed}s`,
      });

      startBlock += SingleModeQueryRange;
    }
  }
}
