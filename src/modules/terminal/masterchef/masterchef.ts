import BigNumber from 'bignumber.js';

import MasterchefAbi from '../../../configs/abi/sushi/masterchef.json';
import UniswapV2Pair from '../../../configs/abi/uniswap/UniswapV2Pair.json';
import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/utils';
import { MasterchefConfig, MasterchefPool } from '../../../types/configs';
import { MasterchefAddressPositionData, MasterchefAddressSnapshot } from '../../../types/domain';
import { ContextServices } from '../../../types/namespaces';
import { TerminalOptions } from '../../../types/options';
import { Terminal } from '../terminal';

const TopicDeposit = '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15';

export class Masterchef extends Terminal {
  public readonly name = 'terminal.masterchef';
  public readonly config: MasterchefConfig;

  constructor(services: ContextServices, options: TerminalOptions) {
    super(services, options);

    // force to use MasterchefConfig type
    this.config = options.config as MasterchefConfig;
  }

  /**
   * Helps to find the pool config from static data
   * @param pid - the masterchef pool id
   * @return MasterchefPool or null on failed
   */
  protected async getPoolInfo(pid: number): Promise<MasterchefPool | null> {
    for (const staticPool of this.config.pools) {
      if (staticPool.pid === pid) {
        return staticPool;
      }
    }

    try {
      const poolInfo = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: this.config.address,
        abi: MasterchefAbi,
        method: 'poolInfo',
        params: [pid],
      });
      const token0Address = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: poolInfo.lpToken,
        abi: UniswapV2Pair,
        method: 'token0',
        params: [],
      });
      const token1Address = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: poolInfo.lpToken,
        abi: UniswapV2Pair,
        method: 'token1',
        params: [],
      });
      const token0 = await this.services.web3.getTokenErc20Info(this.config.chain, token0Address);
      const token1 = await this.services.web3.getTokenErc20Info(this.config.chain, token1Address);

      return {
        pid,
        stakingToken: {
          address: normalizeAddress(poolInfo.lpToken),
          token0,
          token1,
        },
      };
    } catch (e: any) {}

    return null;
  }

  /**
   * Helps to get pool address info
   * @param pid - the masterchef pool id
   * @param address - the user address
   * @param blockNumber - block number where data to be got
   * @return number - the user balance
   */
  protected async getPoolUserBalance(pid: number, address: string, blockNumber: number): Promise<number> {
    try {
      const userInfo = await this.services.web3.singlecall({
        chain: this.config.chain,
        address: this.config.address,
        abi: MasterchefAbi,
        method: 'userInfo',
        params: [pid, address],
        blockNumber: blockNumber,
      });
      return new BigNumber(userInfo.amount.toString()).dividedBy(1e18).toNumber();
    } catch (e: any) {}

    return 0;
  }

  public async getAddresses(): Promise<Array<string>> {
    const rawlogsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.rawlogs);
    const cursor = rawlogsCollection.find({
      chain: this.config.chain,
      address: this.config.address,
    });

    const abiCoder = this.services.web3.getProvider(this.config.chain).eth.abi;

    const addresses: { [key: string]: boolean } = {};
    while (await cursor.hasNext()) {
      const document = await cursor.next();

      if (document) {
        const address = normalizeAddress(abiCoder.decodeParameter('address', document.topics[1].toString()).toString());
        addresses[address] = true;
      }
    }

    await cursor.close();

    return Object.keys(addresses);
  }

  public async getAddressSnapshot(address: string, timestamp: number): Promise<MasterchefAddressSnapshot | null> {
    const blockNumber = await this.services.web3.getBlockAtTimestamp(this.config.chain, timestamp);

    const snapshot: MasterchefAddressSnapshot = {
      metric: 'masterchef',
      blockNumber: blockNumber,
      timestamp: timestamp,
      chain: this.config.chain,
      protocol: this.config.protocol,
      version: this.config.version,
      masterchef: this.config.address,
      address: normalizeAddress(address),
      positions: [],
    };

    const rawlogsCollection = await this.services.mongo.getCollection(EnvConfig.mongo.collections.rawlogs);
    const abiCoder = this.services.web3.getProvider(this.config.chain).eth.abi;
    const addressParam = abiCoder.encodeParameter('address', address);

    const cursor = rawlogsCollection
      .find({
        chain: this.config.chain,
        address: this.config.address,
        'topics.0': TopicDeposit,
        'topics.1': addressParam,
      })
      .sort({ timestamp: 1 });

    const positions: { [key: number]: MasterchefAddressPositionData } = {};
    while (await cursor.hasNext()) {
      const document = await cursor.next();
      if (document) {
        const pid = Number(abiCoder.decodeParameter('uint256', document.topics[2]).toString());
        const amount = new BigNumber(abiCoder.decodeParameter('uint256', document.data).toString())
          .dividedBy(1e18)
          .toNumber();

        const poolConfig = await this.getPoolInfo(pid);
        if (poolConfig) {
          if (positions[pid]) {
            positions[pid].depositVolume += amount;
          } else {
            const userBalance = await this.getPoolUserBalance(pid, address, blockNumber);
            positions[pid] = {
              ...poolConfig,
              depositVolume: amount,
              depositBalance: userBalance,
              depositFirstTime: document.timestamp,
            };
          }
        }
      }
    }
    await cursor.close();

    for (const [, position] of Object.entries(positions)) {
      snapshot.positions.push(position);
    }

    return snapshot;
  }
}
