import { Collection } from 'mongodb';
import Web3 from 'web3';

import { LendingMarketConfig, Token } from './configs';
import { DataMetric } from './domain';
import { BlockAndTime, GetBlockTimesOptions, IndexOptions, Web3SingleCallOptions } from './options';

export interface IProvider {
  name: string;
}

export interface IMongoService extends IProvider {
  connect: (url: string, name: string) => Promise<void>;
  getCollection: (name: string) => Promise<Collection>;
}

export interface IWeb3Service extends IProvider {
  providers: { [key: string]: Web3 };

  // get initialized web3 provider
  getProvider: (chain: string) => Web3;

  // get erc20 token info
  getTokenErc20Info: (chain: string, address: string) => Promise<Token | null>;
  getTokenErc20InfoFromChain: (chain: string, address: string) => Promise<Token | null>;

  // get block number at given timestamp
  getBlockAtTimestamp: (chain: string, timestamp: number) => Promise<number>;

  // read contract with a single call
  singlecall: (options: Web3SingleCallOptions) => Promise<any>;

  // help to get block time from node rpc
  getBlockTime: (chain: string, blockNumber: number) => Promise<number>;

  // help to get block timestamp
  // query subgraph and get block timestamp of 1000 blocks
  getBlockTimes: (options: GetBlockTimesOptions) => Promise<{ [key: number]: BlockAndTime }>;
}

export interface IOracleService extends IProvider {
  mongo: IMongoService | null;
  web3: IWeb3Service;

  // this is the entrypoint
  // should return token price in usd value
  getTokenPriceUSD: (chain: string, address: string, timestamp: number) => Promise<number>;
}

export interface ContextServices {
  mongo: IMongoService;
  web3: IWeb3Service;
  oracle: IOracleService;
}

export interface ICollector extends IProvider {
  services: ContextServices;
  metric: DataMetric;
  config: LendingMarketConfig;

  // get metric data snapshot
  getSnapshot: (timestamp: number) => Promise<Array<any> | null>;

  // run daemon updater
  run: () => Promise<void>;
}

export interface IOracleUpdater extends IProvider {
  services: ContextServices;

  // start to run daemon
  run: () => Promise<void>;
}

export interface ILogIndexer extends IProvider {
  services: ContextServices;

  // start the worker
  run: (options: IndexOptions) => Promise<void>;
}
