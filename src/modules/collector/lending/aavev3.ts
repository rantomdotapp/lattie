import BigNumber from 'bignumber.js';

import DataProviderV3Abi from '../../../configs/abi/aave/DataProviderV3.json';
import { normalizeAddress } from '../../../lib/utils';
import { LendingMarketConfig } from '../../../types/configs';
import { LendingMarketSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { CollectorOptions } from '../../../types/options';
import { BaseCollector } from '../base';

export class Aavev3Collector extends BaseCollector {
  public readonly name: string = 'aavev3';

  constructor(services: ContextServices, options: CollectorOptions) {
    super(services, options);
  }

  public async getSnapshot(timestamp: number): Promise<Array<LendingMarketSnapshot> | null> {
    const markets: Array<LendingMarketSnapshot> = [];

    const config: LendingMarketConfig = this.config as LendingMarketConfig;

    const blockNumber = await this.services.web3.getBlockAtTimestamp(config.chain, timestamp);

    const reserveData: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.contracts.dataProvider,
      abi: DataProviderV3Abi,
      method: 'getReserveData',
      params: [config.token.address],
      blockNumber: blockNumber,
    });

    if (!reserveData) {
      return null;
    }

    const totalAToken = new BigNumber(reserveData[2].toString());
    const totalStableDebt = new BigNumber(reserveData[3].toString());
    const totalVariableDebt = new BigNumber(reserveData[4].toString());

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

      borrowRate: new BigNumber(reserveData[6].toString()).dividedBy(1e27).toNumber(),
      borrowRateStable: new BigNumber(reserveData[7].toString()).dividedBy(1e27).toNumber(),
      supplyRate: new BigNumber(reserveData[5].toString()).dividedBy(1e27).toNumber(),
      totalSupply: totalAToken.dividedBy(new BigNumber(10).pow(config.token.decimals)).toNumber(),
      totalBorrow: totalStableDebt
        .plus(totalVariableDebt)
        .dividedBy(new BigNumber(10).pow(config.token.decimals))
        .toNumber(),
    };

    markets.push(market);

    return markets;
  }
}
