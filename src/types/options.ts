import { LendingMarketConfig } from './configs';
import { DataMetric } from './domain';

export interface Web3SingleCallOptions {
  chain: string;
  address: string;
  abi: any;
  method: string;
  params: Array<any>;
  blockNumber?: number;
}

export interface CollectorOptions {
  metric: DataMetric;
  config: LendingMarketConfig;
  fromTime: number;
}

export interface GetBlockTimesOptions {
  chain: string;
  fromBlock: number;
  numberOfBlocks: number; // default 2000
}

export interface BlockAndTime {
  chain: string;
  blockNumber: number;
  timestamp: number;
}

export interface IndexOptions {
  // default ethereum
  chain: string;

  // by default, worker run in whole network mode
  // it queries all logs from network
  // filters and saves them by configs in the database

  // if address and topic was given
  // run worker in the single contract mode
  address?: string;

  // ignore if it is zero, default: 0
  // in both single and network mode
  // if fromBlock was given
  // start to index logs from given fromBlock, ignore birthBlock and stateBlock config
  fromBlock: number;
}
