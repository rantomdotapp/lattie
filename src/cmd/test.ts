import { LendingMarketConfigs } from '../configs/lending';
import { getTimestamp } from '../lib/utils';
import { OracleService } from '../services/oracle';
import { Web3Service } from '../services/web3';
import { Token } from '../types/configs';
import { BasicCommand } from './basic';

export class TestCommand extends BasicCommand {
  public readonly name: string = 'test';
  public readonly describe: string = 'Run anything in test source';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const tokens: Array<Token> = [];
    const foundTokens: { [key: string]: boolean } = {};

    for (const market of LendingMarketConfigs) {
      if (!foundTokens[`${market.chain}:${market.token.address}`]) {
        tokens.push(market.token);
        foundTokens[`${market.chain}:${market.token.address}`] = true;
      }
    }

    const oracle = new OracleService(null, new Web3Service());
    for (const token of tokens) {
      const priceUSD = await oracle.getTokenPriceUSD(token.chain, token.address, getTimestamp());

      console.log(`${token.chain}:${token.symbol}:${token.address} - $${priceUSD}`);
    }
  }
}
