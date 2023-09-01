import BigNumber from 'bignumber.js';

import cErc20Abi from '../../../configs/abi/compound/cErc20.json';
import { ChainBlockTime } from '../../../configs/constants';
import { normalizeAddress } from '../../../lib/utils';
import { LendingMarketConfig } from '../../../types/configs';
import { LendingMarketSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { CollectorOptions } from '../../../types/options';
import { BaseCollector } from '../base';

export class CompoundCollector extends BaseCollector {
  public readonly name: string = 'compound';

  constructor(services: ContextServices, options: CollectorOptions) {
    super(services, options);
  }

  public async getSnapshot(timestamp: number): Promise<Array<LendingMarketSnapshot> | null> {
    const markets: Array<LendingMarketSnapshot> = [];

    const config: LendingMarketConfig = this.config as LendingMarketConfig;

    const blockNumber = await this.services.web3.getBlockAtTimestamp(config.chain, timestamp);

    const getCash: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: cErc20Abi,
      method: 'getCash',
      params: [],
      blockNumber: blockNumber,
    });
    const totalBorrows: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: cErc20Abi,
      method: 'totalBorrows',
      params: [],
      blockNumber: blockNumber,
    });
    const totalReserves: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: cErc20Abi,
      method: 'totalReserves',
      params: [],
      blockNumber: blockNumber,
    });
    const borrowRatePerBlock: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: cErc20Abi,
      method: 'borrowRatePerBlock',
      params: [],
      blockNumber: blockNumber,
    });
    const supplyRatePerBlock: any = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.address,
      abi: cErc20Abi,
      method: 'supplyRatePerBlock',
      params: [],
      blockNumber: blockNumber,
    });

    const totalBorrow = new BigNumber(totalBorrows.toString());
    const totalSupply = new BigNumber(getCash.toString())
      .plus(totalBorrow)
      .minus(new BigNumber(totalReserves.toString()));

    const blockPerYear = (365 * 24 * 60 * 60) / ChainBlockTime[config.chain];
    const borrowRate = new BigNumber(borrowRatePerBlock.toString()).multipliedBy(blockPerYear).dividedBy(1e18);
    const supplyRate = new BigNumber(supplyRatePerBlock.toString()).multipliedBy(blockPerYear).dividedBy(1e18);

    const tokenPrice: number = await this.services.oracle.getTokenPriceUSD(
      config.chain,
      config.token.address,
      timestamp,
    );

    markets.push({
      metric: 'lending',
      timestamp: timestamp,
      blockNumber: blockNumber,

      protocol: config.protocol,
      chain: config.chain,
      version: config.version,
      address: normalizeAddress(config.address),
      token: config.token,
      tokenPriceUSD: tokenPrice,

      borrowRate: borrowRate.toNumber(),
      supplyRate: supplyRate.toNumber(),

      totalSupply: totalSupply.dividedBy(new BigNumber(10).pow(config.token.decimals)).toNumber(),
      totalBorrow: totalBorrow.dividedBy(new BigNumber(10).pow(config.token.decimals)).toNumber(),
    });

    return markets;
  }
}
