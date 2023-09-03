import BigNumber from 'bignumber.js';

import LendingPoolV1Abi from '../../../configs/abi/aave/LendingPoolV1.json';
import { AddressEee, AddressZero } from '../../../configs/constants';
import { normalizeAddress } from '../../../lib/utils';
import { LendingMarketConfig } from '../../../types/configs';
import { LendingMarketSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { CollectorOptions } from '../../../types/options';
import { BaseCollector } from '../base';

export class Aavev1Collector extends BaseCollector {
  public readonly name: string = 'aavev1';

  constructor(services: ContextServices, options: CollectorOptions) {
    super(services, options);
  }

  public async getSnapshot(timestamp: number): Promise<Array<LendingMarketSnapshot> | null> {
    const markets: Array<LendingMarketSnapshot> = [];

    const config: LendingMarketConfig = this.config as LendingMarketConfig;

    const blockNumber = await this.services.web3.getBlockAtTimestamp(config.chain, timestamp);

    const reserveData: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: LendingPoolV1Abi,
      method: 'getReserveData',
      params: [config.token.address === AddressZero ? AddressEee : config.token.address],
      blockNumber: blockNumber,
    });

    const market: LendingMarketSnapshot = {
      metric: 'lending',
      timestamp: timestamp,
      blockNumber: blockNumber,
      protocol: config.protocol,
      chain: config.chain,
      version: config.version,
      address: normalizeAddress(config.address),
      token: config.token,
      tokenPriceUSD: await this.services.oracle.getTokenPriceUSD(config.token.chain, config.token.address, timestamp),

      borrowRate: new BigNumber(reserveData[5].toString()).dividedBy(1e27).toNumber(),
      borrowRateStable: new BigNumber(reserveData[6].toString()).dividedBy(1e27).toNumber(),
      supplyRate: new BigNumber(reserveData[4].toString()).dividedBy(1e27).toNumber(),
      totalSupply: new BigNumber(reserveData[0].toString())
        .dividedBy(new BigNumber(10).pow(config.token.decimals))
        .toNumber(),
      totalBorrow: new BigNumber(reserveData[1].toString())
        .plus(new BigNumber(reserveData[2].toString()))
        .dividedBy(new BigNumber(10).pow(config.token.decimals))
        .toNumber(),
    };

    markets.push(market);

    return markets;
  }
}
