import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { getTimestamp } from '../../lib/utils';
import { LendingMarketConfig, MasterchefConfig } from '../../types/configs';
import { DataMetric } from '../../types/domain';
import { ContextServices, ITerminal } from '../../types/namespaces';
import { TerminalOptions } from '../../types/options';

export class Terminal implements ITerminal {
  public readonly name: string = 'terminal';
  public readonly config: LendingMarketConfig | MasterchefConfig;
  public readonly metric: DataMetric;
  public readonly services: ContextServices;

  constructor(services: ContextServices, options: TerminalOptions) {
    this.config = options.config;
    this.metric = options.metric;
    this.services = services;
  }

  public async getAddresses(): Promise<Array<string>> {
    return [];
  }

  public async getAddressSnapshot(address: string, timestamp: number): Promise<any> {
    return null;
  }

  public async run(): Promise<void> {
    const currentTimestamp = getTimestamp();
    const terminalCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.terminal);

    // query all addresses
    const addresses: Array<string> = await this.getAddresses();

    logger.info(`start terminal collect addresses info`, {
      service: this.name,
      protocol: this.config.protocol,
      chain: this.config.chain,
      version: this.config.version,
      contract: this.config.address,
      addressCount: addresses.length,
    });

    for (const address of addresses) {
      const snapshot = await this.getAddressSnapshot(address, currentTimestamp);
      await terminalCollection.updateOne(
        {
          chain: this.config.chain,
          address: address,
          protocol: this.config.protocol,
          contract: this.config.address,
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

      logger.debug('updated terminal address snapshot', {
        service: this.name,
        protocol: this.config.protocol,
        chain: this.config.chain,
        version: this.config.version,
        contract: this.config.address,
        address: address,
      });
    }
  }
}
