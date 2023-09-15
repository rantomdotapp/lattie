import { LendingMarketVersion, MasterchefPool, MasterchefVersion, Token } from './configs';

export interface ContractLog {
  chain: string;
  address: string; // contract address
  topics: Array<string>;
  data: string;
  blockNumber: number;
  timestamp: number;
  transactionHash: string;
  logIndex: number;
}

export type DataMetric = 'lending' | 'masterchef';

export interface SnapshotMetadata {
  metric: DataMetric;
  blockNumber: number;
  timestamp: number;
}

export interface LendingTokenSnapshot {
  // token
  token: Token;

  // usd spot price of token
  tokenPriceUSD: number;

  totalSupply: number;
}

export interface LendingMarketSnapshot extends SnapshotMetadata, LendingTokenSnapshot {
  // protocol own this market
  protocol: string;

  // the blockchain on where this market operate
  chain: string;
  version: LendingMarketVersion;

  // the market address
  address: string;

  // variable borrow rate
  borrowRate: number;

  // aave has two diff borrow rate types
  borrowRateStable?: number;

  supplyRate: number;

  // total token was borrowed
  totalBorrow: number;

  // used for CDP or multiple collateral for a single borrow token protocol
  collateralAssets?: Array<LendingTokenSnapshot>;
}

export interface MasterchefSnapshot extends SnapshotMetadata {
  // protocol own this market
  protocol: string;

  // the blockchain on where this market operate
  chain: string;
  version: MasterchefVersion;

  // the masterchef contract address
  address: string;

  // unique farmer addresses count
  userCount: number;

  // total volume USD
  // we calculate the price of LP tokens
  totalVolumeUSD: number;

  // number of transactions
  transactionCount: number;
}

export interface MasterchefAddressPositionData extends MasterchefPool {
  // total deposit volume from the beginning
  depositVolume: number;
  // current balance deposited
  depositBalance: number;
  // the first time deposit timestamp
  depositFirstTime: number;
}

export interface MasterchefAddressSnapshot extends SnapshotMetadata {
  chain: string;
  protocol: string;
  version: string;
  masterchef: string; // masterchef contract address
  address: string; // user address
  positions: Array<MasterchefAddressPositionData>;
}
