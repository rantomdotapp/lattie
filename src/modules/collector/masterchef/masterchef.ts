import BigNumber from 'bignumber.js';

import Erc20Abi from '../../../configs/abi/ERC20.json';
import MasterchefAbi from '../../../configs/abi/sushi/masterchef.json';
import UniswapV2Pair from '../../../configs/abi/uniswap/UniswapV2Pair.json';
import { TokenWrapNatives } from '../../../configs/constants';
import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/utils';
import { MasterchefConfig, MasterchefPool } from '../../../types/configs';
import { MasterchefSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { CollectorOptions } from '../../../types/options';
import { UniswapOracleLib } from '../../oracles/libs/uniswap';
import { BaseCollector } from '../base';

// the original sushi masterchef
export class MasterChefCollector extends BaseCollector {
  public readonly name: string = 'masterchef';
  private readonly _lpPriceCaches: any;

  constructor(services: ContextServices, options: CollectorOptions) {
    super(services, options);

    this._lpPriceCaches = {};
  }

  /**
   * Helps to find the pool config from static data
   * @param pid - the masterchef pool id
   * @return MasterchefPool or null on failed
   */
  protected async getPoolInfo(pid: number): Promise<MasterchefPool | null> {
    const config: MasterchefConfig = this.config as MasterchefConfig;
    for (const staticPool of config.pools) {
      if (staticPool.pid === pid) {
        return staticPool;
      }
    }

    try {
      const poolInfo = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: this.config.address,
        abi: MasterchefAbi,
        method: 'poolInfo',
        params: [pid],
      });
      const token0Address = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: poolInfo.lpToken,
        abi: UniswapV2Pair,
        method: 'token0',
        params: [],
      });
      const token1Address = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: poolInfo.lpToken,
        abi: UniswapV2Pair,
        method: 'token1',
        params: [],
      });
      const token0 = await this.services.web3.getTokenErc20Info(this.config.chain, token0Address);
      const token1 = await this.services.web3.getTokenErc20Info(this.config.chain, token1Address);

      return {
        pid,
        stakingToken: {
          address: normalizeAddress(poolInfo.lpToken),
          token0,
          token1,
        },
      };
    } catch (e: any) {}

    return null;
  }

  protected async getLpPriceUsd(poolConfig: MasterchefPool, timestamp: number, blockNumber: number): Promise<number> {
    const config: MasterchefConfig = this.config as MasterchefConfig;

    const cacheKey = `${poolConfig.pid}-${poolConfig.stakingToken.address}-${blockNumber}`;
    if (this._lpPriceCaches[cacheKey] !== undefined) {
      return Number(this._lpPriceCaches[cacheKey]);
    }

    let lpPriceUSD = 0;
    try {
      // get lp spot price by wrap native token
      const lpPriceVsWrapNative = await UniswapOracleLib.getLpSpotPriceV2(this.services.web3, {
        chain: config.chain,
        lpAddress: poolConfig.stakingToken.address,
        tokenBase: TokenWrapNatives[config.chain],
        blockNumber: blockNumber,
      });
      if (lpPriceVsWrapNative > 0) {
        const nativePriceUSD = await this.services.oracle.getTokenPriceUSD(
          config.chain,
          TokenWrapNatives[config.chain].address,
          timestamp,
        );
        lpPriceUSD = lpPriceVsWrapNative * nativePriceUSD;
      }
    } catch (e: any) {
      console.log(e);
    }

    this._lpPriceCaches[cacheKey] = lpPriceUSD;

    return lpPriceUSD;
  }

  public async getSnapshot(timestamp: number): Promise<Array<MasterchefSnapshot> | null> {
    const config: MasterchefConfig = this.config as MasterchefConfig;
    const endDateTimestamp = timestamp + 24 * 60 * 60;

    const abiCoder = this.services.web3.getProvider(this.config.chain).eth.abi;
    const blockNumber = await this.services.web3.getBlockAtTimestamp(config.chain, timestamp);
    const blockNumberEndDate = await this.services.web3.getBlockAtTimestamp(config.chain, endDateTimestamp - 1);

    const rawlogsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.rawlogs);

    const cursor = rawlogsCollection
      .find({
        chain: config.chain,
        address: config.address,
        timestamp: {
          $gte: timestamp,
          $lt: endDateTimestamp,
        },
      })
      .sort({ timestamp: 1 });

    let userCount = 0;
    let totalVolumeUSD = 0;
    let transactionCount = 0;

    const addresses: any = {};
    const transactions: any = {};
    while (await cursor.hasNext()) {
      const document = await cursor.next();
      if (document) {
        const pid = Number(abiCoder.decodeParameter('uint256', document.topics[2]).toString());
        const address = normalizeAddress(abiCoder.decodeParameter('address', document.topics[1]).toString());
        const amount = normalizeAddress(abiCoder.decodeParameter('address', document.data).toString());

        // now we find the pool config from static data
        const poolConfig: MasterchefPool | null = await this.getPoolInfo(pid);
        if (poolConfig) {
          const lpPriceUSD = await this.getLpPriceUsd(poolConfig, timestamp, blockNumber);
          totalVolumeUSD += new BigNumber(amount.toString()).multipliedBy(lpPriceUSD).dividedBy(1e18).toNumber();
        }

        if (!addresses[address]) {
          userCount += 1;
          addresses[address] = true;
        }
        if (!transactions[document.transactionHash]) {
          transactionCount += 1;
          transactions[document.transactionHash] = true;
        }
      }
    }

    await cursor.close();

    const rewardSupplyBefore = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.rewardToken.address,
      abi: Erc20Abi,
      method: 'totalSupply',
      params: [],
      blockNumber: blockNumber,
    });
    const rewardSupplyAfter = await this.services.web3.singlecall({
      chain: config.chain,
      address: config.rewardToken.address,
      abi: Erc20Abi,
      method: 'totalSupply',
      params: [],
      blockNumber: blockNumberEndDate,
    });
    const rewardTokenMinted = new BigNumber(rewardSupplyAfter.toString())
      .minus(new BigNumber(rewardSupplyBefore.toString()))
      .dividedBy(new BigNumber(10).pow(config.rewardToken.decimals));

    const rewardTokenPriceUsd = await this.services.oracle.getTokenPriceUSD(
      config.chain,
      config.rewardToken.address,
      timestamp,
    );

    return [
      {
        metric: 'masterchef',
        timestamp,
        blockNumber,
        protocol: config.protocol,
        chain: config.chain,
        version: config.version,
        address: config.address,
        userCount: userCount,
        totalVolumeUSD: totalVolumeUSD,
        transactionCount: transactionCount,
        rewardTokenSupply: new BigNumber(rewardSupplyAfter.toString())
          .dividedBy(new BigNumber(10).pow(config.rewardToken.decimals))
          .toNumber(),
        rewardTokenMinted: rewardTokenMinted.toNumber(),
        rewardTokenPriceUsd: rewardTokenPriceUsd,
      },
    ];
  }
}
