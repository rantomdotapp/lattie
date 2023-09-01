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
