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
