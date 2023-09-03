import { IndexConfig } from '../types/configs';

export const LogindexConfigs: Array<IndexConfig> = [
  {
    chain: 'ethereum',
    address: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    topics: [
      '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15', // Deposit
      '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568', // Withdraw
      '0xbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae0595', // EmergencyWithdraw
    ],
    birthBlock: 10736242,
  },
];
