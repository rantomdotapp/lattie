import BigNumber from 'bignumber.js';

import DataProviderV2Abi from '../../../configs/abi/aave/DataProviderV2.json';
import { normalizeAddress } from '../../../lib/utils';
import { LendingMarketConfig } from '../../../types/configs';
import { LendingMarketSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { CollectorOptions } from '../../../types/options';
import { BaseCollector } from '../base';

export class Aavev2Collector extends BaseCollector {
  public readonly name: string = 'aavev2';

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
      abi: DataProviderV2Abi,
      method: 'getReserveData',
      params: [config.token.address],
      blockNumber: blockNumber,
    });

    const availableLiquidity = new BigNumber(reserveData[0].toString());
    const totalStableDebt = new BigNumber(reserveData[1].toString());
    const totalVariableDebt = new BigNumber(reserveData[2].toString());

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

      borrowRate: new BigNumber(reserveData[4].toString()).dividedBy(1e27).toNumber(),
      borrowRateStable: new BigNumber(reserveData[5].toString()).dividedBy(1e27).toNumber(),
      supplyRate: new BigNumber(reserveData[3].toString()).dividedBy(1e27).toNumber(),
      totalSupply: availableLiquidity
        .plus(totalStableDebt)
        .plus(totalVariableDebt)
        .dividedBy(new BigNumber(10).pow(config.token.decimals))
        .toNumber(),
      totalBorrow: totalStableDebt
        .plus(totalVariableDebt)
        .dividedBy(new BigNumber(10).pow(config.token.decimals))
        .toNumber(),
    };

    markets.push(market);

    return markets;
  }
}
