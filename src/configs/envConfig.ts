import dotenv from 'dotenv';

import { EnvConfig } from '../types/configs';
import { MongodbPrefix } from './constants';

// global env and configurations
dotenv.config();

const envConfig: EnvConfig = {
  mongo: {
    databaseName: String(process.env.LATTIE_MONGODB_NAME),
    connectionUri: String(process.env.LATTIE_MONGODB_URI),
    collections: {
      states: `${MongodbPrefix}.lattie.states`,
      metrics: `${MongodbPrefix}.lattie.metrics`,
      oracles: `${MongodbPrefix}.lattie.oracles`,
      rawlogs: `${MongodbPrefix}.lattie.rawlogs`,
    },
  },
  sentry: {
    dns: String(process.env.LATTIE_SENTRY_DNS),
  },
  blockchains: {
    ethereum: {
      name: 'ethereum',
      nodeRpc: String(process.env.LATTIE_ETHEREUM_NODE),
      blockSubgraph: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    },
    polygon: {
      name: 'polygon',
      nodeRpc: String(process.env.LATTIE_POLYGON_NODE),
      blockSubgraph: 'https://api.thegraph.com/subgraphs/name/matthewlilley/polygon-blocks',
    },
    avalanche: {
      name: 'avalanche',
      nodeRpc: String(process.env.LATTIE_AVALANCHE_NODE),
      blockSubgraph: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks',
    },
    arbitrum: {
      name: 'arbitrum',
      nodeRpc: String(process.env.LATTIE_ARBITRUM_NODE),
      blockSubgraph: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
    },
    optimism: {
      name: 'optimism',
      nodeRpc: String(process.env.LATTIE_OPTIMISM_NODE),
      blockSubgraph: 'https://api.thegraph.com/subgraphs/name/ianlapham/uni-testing-subgraph',
    },
    base: {
      name: 'base',
      nodeRpc: String(process.env.LATTIE_BASE_NODE),
      blockSubgraph: 'https://api.studio.thegraph.com/query/48211/base-blocks/version/latest',
    },
  },
};

export default envConfig;
