export type ChainName = 'ethereum' | 'polygon' | 'avalanche' | 'arbitrum' | 'optimism' | 'base' | 'bnbchain';

export interface Blockchain {
  name: ChainName;
  nodeRpc: string;
  blockSubgraph: string;
}

export interface Token {
  chain: string;
  symbol: string;
  decimals: number;
  address: string;
}

export interface EnvConfig {
  mongo: {
    databaseName: string;
    connectionUri: string;
    collections: {
      states: string;
      metrics: string;
      oracles: string;
      rawlogs: string;
    };
  };
  sentry: {
    dns: string;
  };
  blockchains: {
    [key: string]: Blockchain;
  };
}

export interface IndexConfig {
  chain: string;
  address: string; // contract address
  topics: Array<Array<string>>; // the topics to be indexed

  birthBlock: number;
}

export interface Contract {
  chain: string;
  abi: any;
  address: string;
  birthBlock: number;
}

export type OracleType = 'chainlink' | 'univ2' | 'univ3' | 'balancer' | 'coingecko';

export interface OracleSource {
  type: OracleType;
  chain: string;
  address: string;
}

export interface OracleChainlink extends OracleSource {
  decimals: number;
}

export interface OraclePool2 extends OracleSource {
  // the token we are getting the price
  baseToken: Token;

  // the quote token for getting price
  quoteToken: Token;
}

export interface OracleCoingecko extends OracleSource {
  coingeckoId: string;
}

export type OracleConfig = OracleChainlink | OraclePool2 | OracleCoingecko;

export type LendingMarketVersion = 'aavev1' | 'aavev2' | 'aavev3' | 'compound' | 'compoundv3';

export interface LendingMarketConfig {
  version: LendingMarketVersion;
  protocol: string;
  chain: string;
  address: string;
  birthBlock: number;
  token: Token;

  // additional and utility contracts
  contracts?: any;
}

export const LiquidityPoolVersions: Array<string> = ['univ2', 'univ3'];
export type LiquidityPoolVersion = (typeof LiquidityPoolVersions)[number];

export interface LiquidityPoolConfig extends Contract {
  protocol: string;
  version: LiquidityPoolVersion;

  // list of token in the pool
  tokens: Array<Token>;
}
