// this config updater query constants data on-chain and update static configs
import fs from 'fs';

import EnvConfig from '../../configs/envConfig';
import { Token } from '../../types/configs';
import { getAaveReserves } from './aave';
import { getCompoundMarkets } from './compound';
import { getSushiMasterchefPools } from './sushi';
import { LendingMarketConstant, MasterchefPoolConstant } from './types';

export class Updater {
  public async run() {
    const pools: Array<MasterchefPoolConstant> = await getSushiMasterchefPools();

    let markets: Array<LendingMarketConstant> = await getAaveReserves();
    markets = markets.concat(await getCompoundMarkets());

    const foundTokens: { [key: string]: Token } = {};
    for (const market of markets) {
      foundTokens[`${market.token.chain}:${market.token.address}`] = market.token;
    }
    for (const pool of pools) {
      if (pool.stakingToken.token0) {
        foundTokens[`${pool.stakingToken.token0.chain}:${pool.stakingToken.token0.address}`] = pool.stakingToken.token0;
      }
      if (pool.stakingToken.token1) {
        foundTokens[`${pool.stakingToken.token1.chain}:${pool.stakingToken.token1.address}`] = pool.stakingToken.token1;
      }
    }

    for (const chain of Object.keys(EnvConfig.blockchains)) {
      const chainTokens: Array<Token> = Object.keys(foundTokens)
        .map((key) => foundTokens[key])
        .filter((item) => item.chain === chain);

      const tokens: { [key: string]: Token } = {};
      for (const chainToken of chainTokens) {
        tokens[chainToken.symbol] = chainToken;
      }

      fs.writeFileSync(`./src/configs/tokens/${chain}.json`, JSON.stringify(tokens));
    }

    fs.writeFileSync(`./src/configs/data/LendingMarkets.json`, JSON.stringify(markets));
    fs.writeFileSync(`./src/configs/data/MasterchefPools.json`, JSON.stringify(pools));
  }
}
