import { MasterchefConfig } from '../types/configs';
import MasterchefPools from './data/MasterchefPools.json';
import EthereumTokens from './tokens/ethereum.json';

export const MasterchefConfigs: Array<MasterchefConfig> = [
  // sushi masterchef
  {
    chain: 'ethereum',
    version: 'masterchef',
    protocol: 'sushi',
    address: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    birthBlock: 10736242,
    rewardToken: EthereumTokens.SUSHI,
    pools: MasterchefPools.filter(
      (item) => item.chain === 'ethereum' && item.address === '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    ).map((item) => {
      return {
        pid: item.pid,
        stakingToken: {
          address: item.stakingToken.address,
          token0: item.stakingToken.token0,
          token1: item.stakingToken.token1,
        },
      };
    }),
  },
];
