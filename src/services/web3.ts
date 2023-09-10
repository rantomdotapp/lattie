import axios from 'axios';
import Web3 from 'web3';

import Erc20Abi from '../configs/abi/ERC20.json';
import { AddressEee, AddressZero, HardCodeTokens, TokenLists, TokenNatives } from '../configs/constants';
import EnvConfig from '../configs/envConfig';
import logger from '../lib/logger';
import { compareAddress, normalizeAddress, sleep } from '../lib/utils';
import { Token } from '../types/configs';
import { IWeb3Service } from '../types/namespaces';
import { BlockAndTime, GetBlockTimesOptions, Web3SingleCallOptions } from '../types/options';
import { Memcache } from './memcache';

export class Web3Service extends Memcache implements IWeb3Service {
  public readonly name: string = 'web3';
  public readonly providers: { [key: string]: Web3 };

  constructor() {
    super();

    this.providers = {};

    for (const [chain, config] of Object.entries(EnvConfig.blockchains)) {
      this.providers[chain] = new Web3(config.nodeRpc);
    }
  }

  public getProvider(chain: string): Web3 {
    return this.providers[chain];
  }

  public async getTokenErc20Info(chain: string, address: string): Promise<Token | null> {
    address = normalizeAddress(address);

    if (TokenLists[chain]) {
      for (const [, token] of Object.entries(TokenLists[chain])) {
        if (compareAddress((token as Token).address, address)) {
          return token as Token;
        }
      }
    }

    if (address === AddressEee || address === AddressZero) {
      return TokenNatives[chain];
    }

    if (HardCodeTokens[`${chain}:${address}`]) {
      return HardCodeTokens[`${chain}:${address}`];
    }

    return await this.getTokenErc20InfoFromChain(chain, address);
  }

  public async getTokenErc20InfoFromChain(chain: string, address: string): Promise<Token | null> {
    try {
      const symbol: any = await this.singlecall({
        chain: chain,
        address: address,
        abi: Erc20Abi,
        method: 'symbol',
        params: [],
      });
      const decimals: any = await this.singlecall({
        chain: chain,
        address: address,
        abi: Erc20Abi,
        method: 'decimals',
        params: [],
      });

      return {
        chain: chain,
        address: normalizeAddress(address),
        symbol: symbol.toString(),
        decimals: parseInt(decimals.toString()),
      };
    } catch (e: any) {}

    return null;
  }

  public async getBlockAtTimestamp(chain: string, timestamp: number): Promise<number> {
    try {
      const response = await axios.post(
        EnvConfig.blockchains[chain].blockSubgraph,
        {
          query: `
          {
            blocks(first: 1, where: {timestamp_lte: ${timestamp}}, orderBy: timestamp, orderDirection: desc) {
              number
            }
          }
        `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.errors) {
        logger.warn('failed to query subgraph', {
          service: this.name,
          subgraph: EnvConfig.blockchains[chain].blockSubgraph,
          error: response.data.errors[0].message,
          timestamp: timestamp,
        });
        return 0;
      }

      return response.data.data.blocks.length > 0 ? Number(response.data.data.blocks[0].number) : 0;
    } catch (e: any) {
      return 0;
    }
  }

  public async singlecall(options: Web3SingleCallOptions): Promise<any> {
    const startTime = new Date().getTime();

    const contract = new this.providers[options.chain].eth.Contract(options.abi, options.address);

    let result = null;

    try {
      if (options.blockNumber) {
        // @ts-ignore
        result = await contract.methods[options.method](...options.params).call({}, options.blockNumber);
      } else {
        // call from the latest block

        // @ts-ignore
        result = await contract.methods[options.method](...options.params).call();
      }

      const endTime = new Date().getTime();
      const elapsed = endTime - startTime;

      if (elapsed > 3000) {
        logger.warn('take too long for singlecall', {
          service: this.name,
          chain: options.chain,
          address: options.address,
          method: options.method,
          blockNumber: options.blockNumber ? options.blockNumber : null,
          elapsed: `${elapsed}ms`,
        });
      }
    } catch (e: any) {
      logger.warn('singlecall failed', {
        service: this.name,
        chain: options.chain,
        address: options.address,
        method: options.method,
        blockNumber: options.blockNumber ? options.blockNumber : null,
        error: e.message,
      });
    }

    return result;
  }

  public async getBlockTime(chain: string, blockNumber: number): Promise<number> {
    const cacheKey = `block-time-${chain}-${blockNumber}`;
    const cacheData = this.get(cacheKey);
    if (cacheData) {
      return cacheData;
    }

    const web3 = this.getProvider(chain);

    while (true) {
      try {
        const block = await web3.eth.getBlock(blockNumber);
        this.set(cacheKey, block.timestamp);
        return Number(block.timestamp);
      } catch (e: any) {
        logger.error('failed to query block from rpc', {
          service: this.name,
          chain,
          number: blockNumber,
          error: e.message,
        });

        await sleep(5);
      }
    }
  }

  public async getBlockTimes(options: GetBlockTimesOptions): Promise<{ [key: number]: BlockAndTime }> {
    const blockTimes: { [key: number]: BlockAndTime } = {};

    let startBlock = options.fromBlock;
    const endBlock = options.fromBlock + options.numberOfBlocks;

    const queryLimit = 1000;
    while (startBlock <= endBlock) {
      try {
        const response = await axios.post(
          EnvConfig.blockchains[options.chain].blockSubgraph,
          {
            query: `
        {
          blocks(first: ${queryLimit}, where: {number_gte: ${startBlock}}, orderBy: number, orderDirection: asc) {
            number
            timestamp
          }
        }
      `,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.errors) {
          throw Error(`query subgraph error: ${response.data.errors.toString()}`);
        }

        for (const block of response.data.data.blocks) {
          blockTimes[Number(block.number)] = {
            chain: options.chain,
            blockNumber: Number(block.number),
            timestamp: Number(Number(block.timestamp)),
          };
        }

        startBlock += queryLimit;
      } catch (e: any) {
        logger.error('failed to query block time from subgraph', {
          service: this.name,
          ...options,
          error: e.message,
        });

        await sleep(5);
      }
    }

    return blockTimes;
  }
}
