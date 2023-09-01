import { OracleConfig } from '../../types/configs';
import ArbitrumTokens from '../tokens/arbitrum.json';
import AvalancheTokens from '../tokens/avalanche.json';
import EthereumTokens from '../tokens/ethereum.json';
import OptimismTokens from '../tokens/optimism.json';
import PolygonTokens from '../tokens/polygon.json';

// chain:address => OracleConfig
export const OracleConfigPool2Bases: { [key: string]: OracleConfig } = {
  SUSHI: {
    type: 'univ2',
    chain: 'ethereum',
    address: '0x795065dcc9f64b5614c407a6efdc400da6221fb0',
    baseToken: EthereumTokens.SUSHI,
    quoteToken: EthereumTokens.WETH,
  },
  SAI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.SAI,
    quoteToken: EthereumTokens.WETH,
    address: '0xa27c56b3969cfb8fbce427337d98e3bd794ec688',
  },
  USDC: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.USDC,
    quoteToken: EthereumTokens.WETH,
    address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
  },
  USDT: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.USDT,
    quoteToken: EthereumTokens.WETH,
    address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  },
  TUSD: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.TUSD,
    quoteToken: EthereumTokens.WETH,
    address: '0xb4d0d9df2738abE81b87b66c80851292492D1404',
  },
  sUSD: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.sUSD,
    quoteToken: EthereumTokens.WETH,
    address: '0xf80758aB42C3B07dA84053Fd88804bCB6BAA4b5c',
  },
  LEND: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.LEND,
    quoteToken: EthereumTokens.WETH,
    address: '0xab3f9bf1d81ddb224a2014e98b238638824bcf20',
  },
  BAT: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.BAT,
    quoteToken: EthereumTokens.WETH,
    address: '0xb6909b960dbbe7392d405429eb2b3649752b4838',
  },
  KNC: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.KNC,
    quoteToken: EthereumTokens.WETH,
    address: '0x76838fd2f22bdc1d3e96069971e65653173edb2a',
  },
  REP: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.REP,
    quoteToken: EthereumTokens.WETH,
    address: '0xec2d2240d02a8cf63c3fa0b7d2c5a3169a319496',
  },
  MKR: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.MKR,
    quoteToken: EthereumTokens.DAI,
    address: '0x517f9dd285e75b599234f7221227339478d0fcc8',
  },
  MANA: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.MANA,
    quoteToken: EthereumTokens.WETH,
    address: '0x11b1f53204d03e5529f09eb3091939e4fd8c9cf3',
  },
  ZRX: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.ZRX,
    quoteToken: EthereumTokens.WETH,
    address: '0xc6f348dd3b91a56d117ec0071c1e9b83c0996de4',
  },
  SNX: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.SNX,
    quoteToken: EthereumTokens.WETH,
    address: '0x43ae24960e5534731fc831386c07755a2dc33d47',
  },
  UNI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.UNI,
    quoteToken: EthereumTokens.WETH,
    address: '0xd3d2e2692501a5c9ca623199d38826e513033a17',
  },
  BUSD: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.BUSD,
    quoteToken: EthereumTokens.WETH,
    address: '0xc2923b8a9683556a3640ccc2961b2f52b5c4459a',
  },
  ENJ: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.ENJ,
    quoteToken: EthereumTokens.WETH,
    address: '0xe56c60b5f9f7b5fc70de0eb79c6ee7d00efa2625',
  },
  REN: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.REN,
    quoteToken: EthereumTokens.WETH,
    address: '0x8bd1661da98ebdd3bd080f0be4e6d9be8ce9858c',
  },
  YFI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.YFI,
    quoteToken: EthereumTokens.WETH,
    address: '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
  },
  AAVE: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.AAVE,
    quoteToken: EthereumTokens.WETH,
    address: '0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f',
  },
  CRV: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.CRV,
    quoteToken: EthereumTokens.WETH,
    address: '0x3da1313ae46132a397d90d95b1424a9a7e3e0fce',
  },
  GUSD: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.GUSD,
    quoteToken: EthereumTokens.WETH,
    address: '0x4ba950bed410a12c1294df28ed672f50c24297de',
  },
  BAL: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.BAL,
    quoteToken: EthereumTokens.WETH,
    address: '0xa70d458a4d9bc0e6571565faee18a48da5c0d593',
  },
  xSUSHI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.xSUSHI,
    quoteToken: EthereumTokens.WETH,
    address: '0x36e2fcccc59e5747ff63a03ea2e5c0c2c14911e7',
  },
  MIM: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.MIM,
    quoteToken: EthereumTokens.WETH,
    address: '0x07d5695a24904cc1b6e3bd57cc7780b90618e3c4',
  },
  COMP: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.COMP,
    quoteToken: EthereumTokens.WETH,
    address: '0xcffdded873554f362ac02f8fb1f02e5ada10516f',
  },
  RAI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.RAI,
    quoteToken: EthereumTokens.WETH,
    address: '0x8ae720a71622e824f576b4a8c03031066548a3b1',
  },
  AMPL: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.AMPL,
    quoteToken: EthereumTokens.WETH,
    address: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
  },
  DPI: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.DPI,
    quoteToken: EthereumTokens.WETH,
    address: '0x4d5ef58aac27d99935e5b6b4a6778ff292059991',
  },
  FRAX: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.FRAX,
    quoteToken: EthereumTokens.WETH,
    address: '0xc63b0708e2f7e69cb8a1df0e1389a98c35a76d52',
  },
  FEI: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.FEI,
    quoteToken: EthereumTokens.DAI,
    address: '0xbb2e5c2ff298fd96e166f90c8abacaf714df14f8',
  },
  stETH: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.stETH,
    quoteToken: EthereumTokens.WETH,
    address: '0x4028daac072e492d34a3afdbef0ba7e35d8b55c4',
  },
  ENS: {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens.ENS,
    quoteToken: EthereumTokens.WETH,
    address: '0xb87b65dacc6171b3ca8c4a934601d0fcb6c61049',
  },
  CVX: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.CVX,
    quoteToken: EthereumTokens.WETH,
    address: '0x2e4784446a0a06df3d1a040b03e1680ee266c35a',
  },
  '1INCH': {
    type: 'univ2',
    chain: 'ethereum',
    baseToken: EthereumTokens['1INCH'],
    quoteToken: EthereumTokens.WETH,
    address: '0x26aad2da94c59524ac0d93f6d6cbf9071d7086f2',
  },
  LUSD: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.LUSD,
    quoteToken: EthereumTokens.DAI,
    address: '0x16980c16811bde2b3358c1ce4341541a4c772ec9',
  },
  wstETH: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.wstETH,
    quoteToken: EthereumTokens.WETH,
    address: '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa',
  },
  cbETH: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.cbETH,
    quoteToken: EthereumTokens.WETH,
    address: '0x840deeef2f115cf50da625f7368c24af6fe74410',
  },
  rETH: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.rETH,
    quoteToken: EthereumTokens.WETH,
    address: '0xa4e0faa58465a2d369aa21b3e42d43374c6f9613',
  },
  LDO: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.LDO,
    quoteToken: EthereumTokens.WETH,
    address: '0xa3f558aebaecaf0e11ca4b2199cc5ed341edfd74',
  },
  RPL: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.RPL,
    quoteToken: EthereumTokens.WETH,
    address: '0xe42318ea3b998e8355a3da364eb9d48ec725eb45',
  },
  GHST: {
    type: 'univ2',
    chain: 'polygon',
    baseToken: PolygonTokens.GHST,
    quoteToken: PolygonTokens.WMATIC,
    address: '0xf69e93771f11aecd8e554aa165c3fe7fd811530c',
  },
  miMATIC: {
    type: 'univ2',
    chain: 'polygon',
    baseToken: PolygonTokens.miMATIC,
    quoteToken: PolygonTokens.DAI,
    address: '0x74214f5d8aa71b8dc921d8a963a1ba3605050781',
  },
  stMATIC: {
    type: 'univ2',
    chain: 'polygon',
    baseToken: PolygonTokens.stMATIC,
    quoteToken: PolygonTokens.WMATIC,
    address: '0x59db5ea66958b19641b6891fc373b44b567ea15c',
  },
  MaticX: {
    type: 'univ2',
    chain: 'polygon',
    baseToken: PolygonTokens.MaticX,
    quoteToken: PolygonTokens.WMATIC,
    address: '0x12cfbfff0ea06a04dfa50d8597143313c3dd75d4',
  },
  sAVAX: {
    type: 'univ2',
    chain: 'avalanche',
    baseToken: AvalancheTokens.sAVAX,
    quoteToken: AvalancheTokens.WAVAX,
    address: '0x4b946c91c2b1a7d7c40fb3c130cdfbaf8389094d',
  },
  ARB: {
    type: 'univ3',
    chain: 'arbitrum',
    baseToken: ArbitrumTokens.ARB,
    quoteToken: ArbitrumTokens.WETH,
    address: '0xc6f780497a95e246eb9449f5e4770916dcd6396a',
  },
  OP: {
    type: 'univ3',
    chain: 'optimism',
    baseToken: OptimismTokens.OP,
    quoteToken: OptimismTokens.WETH,
    address: '0xfc1f3296458f9b2a27a0b91dd7681c4020e09d05',
  },
  GHO: {
    type: 'univ3',
    chain: 'ethereum',
    baseToken: EthereumTokens.GHO,
    quoteToken: EthereumTokens.USDC,
    address: '0x5c95d4b1c3321cf898d25949f41d50be2db5bc1d',
  },
};