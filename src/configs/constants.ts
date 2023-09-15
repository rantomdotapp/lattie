import { Token } from '../types/configs';
import ArbitrumTokenList from './tokenlists/arbitrum.json';
import AvalancheTokenList from './tokenlists/avalanche.json';
import BaseTokenList from './tokenlists/base.json';
import EthereumTokenList from './tokenlists/ethereum.json';
import OptimismTokenList from './tokenlists/optimism.json';
import PolygonTokenList from './tokenlists/polygon.json';

export const MongodbPrefix = 'rantom';

export const AddressZero = '0x0000000000000000000000000000000000000000';
export const AddressEee = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const TokenNatives: { [key: string]: Token } = {
  ethereum: {
    chain: 'ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: AddressZero,
  },
  polygon: {
    chain: 'polygon',
    symbol: 'MATIC',
    decimals: 18,
    address: AddressZero,
  },
  avalanche: {
    chain: 'avalanche',
    symbol: 'AVAX',
    decimals: 18,
    address: AddressZero,
  },
  arbitrum: {
    chain: 'arbitrum',
    symbol: 'ETH',
    decimals: 18,
    address: AddressZero,
  },
  optimism: {
    chain: 'optimism',
    symbol: 'ETH',
    decimals: 18,
    address: AddressZero,
  },
};

export const TokenWrapNatives: { [key: string]: Token } = {
  ethereum: {
    chain: 'ethereum',
    symbol: 'WETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  base: {
    chain: 'ethereum',
    symbol: 'WETH',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
  },
  polygon: {
    chain: 'polygon',
    symbol: 'WMATIC',
    decimals: 18,
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  },
  avalanche: {
    chain: 'avalanche',
    symbol: 'WAVAX',
    decimals: 18,
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  },
  arbitrum: {
    chain: 'arbitrum',
    symbol: 'WETH',
    decimals: 18,
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  },
  optimism: {
    chain: 'optimism',
    symbol: 'WETH',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
  },
};

export const TokenLists: { [key: string]: { [key: string]: Token } } = {
  ethereum: EthereumTokenList,
  arbitrum: ArbitrumTokenList,
  polygon: PolygonTokenList,
  optimism: OptimismTokenList,
  base: BaseTokenList,
  avalanche: AvalancheTokenList,
};

export const HardCodeTokens: { [key: string]: Token } = {
  // Maker: I don't know why they make things to be complicated :(
  'ethereum:0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
    chain: 'ethereum',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    symbol: 'MKR',
    decimals: 18,
  },
  'ethereum:0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
    chain: 'ethereum',
    address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    symbol: 'SAI',
    decimals: 18,
  },
};

export const ChainBlockTime: { [key: string]: number } = {
  ethereum: 13,
};
