import { Token } from '../../types/configs';

export interface LendingMarketConstant {
  protocol: string;
  chain: string;
  address: string;
  birthBlock: number;
  token: Token;
}
