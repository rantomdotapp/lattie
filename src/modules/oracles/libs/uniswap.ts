import { Token as UniswapSdkToken } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v3-sdk';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import Erc20Abi from '../../../configs/abi/ERC20.json';
import UniswapV3PoolAbi from '../../../configs/abi/uniswap/UniswapV3Pool.json';
import { normalizeAddress } from '../../../lib/utils';
import { OraclePool2, Token } from '../../../types/configs';
import { IWeb3Service } from '../../../types/namespaces';

export interface UniswapGetSpotPriceOptions extends OraclePool2 {
  blockNumber: number;
}

export interface UniswapGetLpSpotPriceOptions {
  chain: string;
  lpAddress: string;
  tokenBase: Token;
  blockNumber: number;
}

export class UniswapOracleLib {
  public static async getSpotPriceV2(web3Provider: Web3, options: UniswapGetSpotPriceOptions): Promise<number> {
    const baseTokenContract = new web3Provider.eth.Contract(Erc20Abi as any, options.baseToken.address);
    const quoteTokenContract = new web3Provider.eth.Contract(Erc20Abi as any, options.quoteToken.address);

    const baseBalance: any = await (baseTokenContract.methods.balanceOf as any)(options.address).call(
      {},
      options.blockNumber,
    );
    const quoteBalance: any = await (quoteTokenContract.methods.balanceOf as any)(options.address).call(
      {},
      options.blockNumber,
    );

    return new BigNumber(quoteBalance.toString())
      .multipliedBy(new BigNumber(10).pow(options.baseToken.decimals))
      .dividedBy(new BigNumber(baseBalance.toString()))
      .dividedBy(new BigNumber(10).pow(options.quoteToken.decimals))
      .toNumber();
  }

  public static async getSpotPriceV3(web3Provider: Web3, options: UniswapGetSpotPriceOptions): Promise<number> {
    const poolContract = new web3Provider.eth.Contract(UniswapV3PoolAbi as any, options.address);

    const poolFee: any = await poolContract.methods.fee().call({}, options.blockNumber);
    const slot0: any = await poolContract.methods.slot0().call({}, options.blockNumber);
    const liquidity: any = await poolContract.methods.liquidity().call({}, options.blockNumber);

    const baseTokenConfig = new UniswapSdkToken(1, options.baseToken.address, options.baseToken.decimals, '', '');
    const quoteTokenConfig = new UniswapSdkToken(1, options.quoteToken.address, options.quoteToken.decimals, '', '');

    const pool = new Pool(
      baseTokenConfig,
      quoteTokenConfig,
      Number(poolFee),
      slot0.sqrtPriceX96.toString(),
      liquidity.toString(),
      new BigNumber(slot0.tick.toString()).toNumber(),
    );

    if (normalizeAddress(pool.token0.address) === normalizeAddress(options.baseToken.address)) {
      return new BigNumber(pool.token0Price.toFixed(12)).toNumber();
    } else {
      return new BigNumber(pool.token1Price.toFixed(12)).toNumber();
    }
  }

  public static async getLpSpotPriceV2(web3: IWeb3Service, options: UniswapGetLpSpotPriceOptions): Promise<number> {
    const baseBalance = await web3.singlecall({
      chain: options.chain,
      address: options.tokenBase.address,
      abi: Erc20Abi,
      method: 'balanceOf',
      params: [options.lpAddress],
      blockNumber: options.blockNumber,
    });
    const lpSupply = await web3.singlecall({
      chain: options.chain,
      address: options.lpAddress,
      abi: Erc20Abi,
      method: 'totalSupply',
      params: [],
      blockNumber: options.blockNumber,
    });

    // LpSpotPrice = BaseTokenBalance * 2 / LpSupply
    return new BigNumber(baseBalance.toString())
      .multipliedBy(2e18)
      .dividedBy(lpSupply.toString())
      .dividedBy(new BigNumber(10).pow(options.tokenBase.decimals))
      .toNumber();
  }
}
