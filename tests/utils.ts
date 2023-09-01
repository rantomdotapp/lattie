import { LendingMarketConfigs } from '../src/configs/lending';
import { Token } from '../src/types/configs';

export function getAllTokens(): Array<Token> {
  const tokens: Array<Token> = [];
  const foundTokens: { [key: string]: boolean } = {};

  for (const market of LendingMarketConfigs) {
    if (!foundTokens[`${market.chain}:${market.token.address}`]) {
      tokens.push(market.token);
      foundTokens[`${market.chain}:${market.token.address}`] = true;
    }
  }

  return tokens;
}
