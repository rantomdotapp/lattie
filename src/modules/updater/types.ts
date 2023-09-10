import { MasterchefVersion, Token } from '../../types/configs';

export interface LendingMarketConstant {
  protocol: string;
  chain: string;
  address: string;
  birthBlock: number;
  token: Token;
}

export interface MasterchefPoolConstant {
  protocol: string;
  chain: string;
  version: MasterchefVersion;
  address: string;
  pid: number;
  stakingToken: {
    address: string;
    token0: Token | null;
    token1: Token | null;
  };
}
