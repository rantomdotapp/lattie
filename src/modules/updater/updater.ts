// this config updater query constants data on-chain and update static configs
import fs from 'fs';

import EnvConfig from '../../configs/envConfig';
import { Token } from '../../types/configs';
import { getAaveReserves } from './aave';
import { getCompoundMarkets } from './compound';
import { LendingMarketConstant } from './types';

export class Updater {
  public async run() {
    let markets: Array<LendingMarketConstant> = await getAaveReserves();
    markets = markets.concat(await getCompoundMarkets());

    const foundTokens: { [key: string]: Token } = {};
    for (const market of markets) {
      foundTokens[`${market.token.chain}:${market.token.address}`] = market.token;
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
  }
}
