import { OracleChainlink } from '../../types/configs';

// chain:address => OracleConfig
export const OracleChainlinkConfigBases: { [key: string]: OracleChainlink } = {
  ETH: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
  },
  WBTC: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
  },
  LINK: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x2c1d072e956affc0d435cb7ac38ef18d24d9127c',
  },
  DAI: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
  },
  EUR: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0xb49f677943bc038e9857d61e7d053caa2c1734c1',
  },
  USDP: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x09023c0da49aaf8fc3fa3adf34c6a7016d38d5e3',
  },
  MATIC: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x7bac85a8a13a4bcd8abb3eb7d6b4d632c5a57676',
  },
  AVAX: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0xff3eeb22b5e3de6e705b44749c2559d704923fd7',
  },
  USDC: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
  },
  USDT: {
    type: 'chainlink',
    chain: 'ethereum',
    decimals: 8,
    address: '0x3e7d1eab13ad0104d2750b8863b489d65364e32d',
  },
};
