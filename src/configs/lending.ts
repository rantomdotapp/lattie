import { LendingMarketConfig, LendingMarketVersion } from '../types/configs';
import LendingMarkets from './data/LendingMarkets.json';

const AaveV2DataProviders: { [key: string]: string } = {
  ethereum: '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d',
  polygon: '0x7551b5D2763519d4e37e8B81929D336De671d46d',
  avalanche: '0x65285E9dfab318f57051ab2b139ccCf232945451',
};

const AaveV3DataProviders: { [key: string]: string } = {
  ethereum: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
  polygon: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
  avalanche: '0x69fa688f1dc47d4b5d8029d5a35fb7a548310654',
  arbitrum: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
  optimism: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
  base: '0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac',
};

export const LendingMarketConfigs: Array<LendingMarketConfig> = [
  ...LendingMarkets.filter((item) => item.protocol === 'aavev1').map((item) => {
    return {
      protocol: item.protocol,
      chain: item.chain,
      version: 'aavev1' as LendingMarketVersion,
      address: item.address,
      birthBlock: item.birthBlock,
      token: item.token,
    };
  }),
  ...LendingMarkets.filter((item) => item.protocol === 'aavev2').map((item) => {
    return {
      protocol: item.protocol,
      chain: item.chain,
      version: 'aavev2' as LendingMarketVersion,
      address: item.address,
      birthBlock: item.birthBlock,
      token: item.token,
      contracts: {
        dataProvider: AaveV2DataProviders[item.chain],
      },
    };
  }),
  ...LendingMarkets.filter((item) => item.protocol === 'aavev3').map((item) => {
    return {
      protocol: item.protocol,
      chain: item.chain,
      version: 'aavev3' as LendingMarketVersion,
      address: item.address,
      birthBlock: item.birthBlock,
      token: item.token,
      contracts: {
        dataProvider: AaveV3DataProviders[item.chain],
      },
    };
  }),
  ...LendingMarkets.filter((item) => item.protocol === 'compound').map((item) => {
    return {
      protocol: item.protocol,
      chain: item.chain,
      version: 'compound' as LendingMarketVersion,
      address: item.address,
      birthBlock: item.birthBlock,
      token: item.token,
      contracts: {
        unitroller: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
      },
    };
  }),
  ...LendingMarkets.filter((item) => item.protocol === 'ironbank').map((item) => {
    return {
      protocol: item.protocol,
      chain: item.chain,
      version: 'compound' as LendingMarketVersion,
      address: item.address,
      birthBlock: item.birthBlock,
      token: item.token,
      contracts: {
        unitroller: '0xab1c342c7bf5ec5f02adea1c2270670bca144cbb',
      },
    };
  }),
];
