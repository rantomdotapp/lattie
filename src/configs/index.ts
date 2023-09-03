import { OracleConfig, Token } from '../types/configs';
import { OracleConfigChainlinkSources, OracleConfigSources } from './oracles/configs';
import ArbitrumTokens from './tokens/arbitrum.json';
import AvalancheTokens from './tokens/avalanche.json';
import EthereumTokens from './tokens/ethereum.json';
import OptimismTokens from './tokens/optimism.json';
import PolygonTokens from './tokens/polygon.json';

export const Tokens: { [key: string]: { [key: string]: Token } } = {
  ethereum: EthereumTokens,
  polygon: PolygonTokens,
  arbitrum: ArbitrumTokens,
  optimism: OptimismTokens,
  avalanche: AvalancheTokens,
};

// chain:address => OracleConfig
export const OracleConfigs: { [key: string]: OracleConfig } = {
  ...OracleConfigSources,
};
export const OracleChainlinkConfigs: { [key: string]: OracleConfig } = {
  ...OracleConfigChainlinkSources,
};

export const GenesisTimes: { [key: string]: number } = {
  lending: 1609459200,
};
