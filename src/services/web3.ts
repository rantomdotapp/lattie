import axios from 'axios';
import { Contract, Web3 } from 'web3';

import Erc20Abi from '../configs/abi/ERC20.json';
import { AddressEee, AddressZero, HardCodeTokens, TokenLists, TokenNatives } from '../configs/constants';
import EnvConfig from '../configs/envConfig';
import logger from '../lib/logger';
import { compareAddress, normalizeAddress } from '../lib/utils';
import { Token } from '../types/configs';
import { IWeb3Service } from '../types/namespaces';
import { Web3SingleCallOptions } from '../types/options';

export class Web3Service implements IWeb3Service {
  public readonly name: string = 'web3';
  public readonly providers: { [key: string]: Web3 };

  constructor() {
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

    const contract = new Contract(options.abi, options.address, this.providers[options.chain]);

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
}
