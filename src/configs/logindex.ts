import { IndexConfig } from '../types/configs';

export const LogindexNetworkStartBlocks: { [key: string]: number } = {
  ethereum: 10736242,
};

export const LogindexConfigs: Array<IndexConfig> = [
  // sushi masterchef
  {
    chain: 'ethereum',
    address: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    topics: [
      [
        '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15', // Deposit
      ],
      [
        '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568', // Withdraw
      ],
      [
        '0xbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae0595', // EmergencyWithdraw
      ],
    ],
    birthBlock: 10736242,
  },
  // sushi masterchef v2
  {
    chain: 'ethereum',
    address: '0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
    topics: [
      [
        '0x02d7e648dd130fc184d383e55bb126ac4c9c60e8f94bf05acdf557ba2d540b47', // Deposit
      ],
      [
        '0x8166bf25f8a2b7ed3c85049207da4358d16edbed977d23fa2ee6f0dde3ec2132', // Withdraw
      ],
      [
        '0x2cac5e20e1541d836381527a43f651851e302817b71dc8e810284e69210c1c6b', // EmergencyWithdraw
      ],
      [
        '0x71bab65ced2e5750775a0613be067df48ef06cf92a496ebf7663ae0660924954', // Harvest
      ],
    ],
    birthBlock: 12428169,
  },
  // sushi token mint
  {
    chain: 'ethereum',
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    topics: [
      // Transfer from zero address
      [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
    ],
    birthBlock: 10736094,
  },
];
