import BigNumber from 'bignumber.js';

import ChainlinkFeedAbi from '../../../configs/abi/chainlink/Feed.json';
import { OracleChainlink } from '../../../types/configs';
import { IWeb3Service } from '../../../types/namespaces';

export interface ChainlinkGetSpotPriceOptions extends OracleChainlink {
  blockNumber: number;
}

export class ChainlinkOracleLib {
  public static async getSpotPrice(web3Service: IWeb3Service, config: ChainlinkGetSpotPriceOptions): Promise<number> {
    const latestAnswer: any = await web3Service.singlecall({
      chain: config.chain,
      address: config.address,
      abi: ChainlinkFeedAbi as any,
      method: 'latestAnswer',
      params: [],
      blockNumber: config.blockNumber,
    });

    return new BigNumber(latestAnswer.toString()).dividedBy(new BigNumber(10).pow(config.decimals)).toNumber();
  }
}
