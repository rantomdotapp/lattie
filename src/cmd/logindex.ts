import fs from 'fs';

import { LogindexConfigs } from '../configs/logindex';
import { normalizeAddress, sleep } from '../lib/utils';
import { LogIndexer } from '../modules/logindex/indexer';
import { IndexConfig } from '../types/configs';
import { BasicCommand } from './basic';

export class LogindexCommand extends BasicCommand {
  public readonly name: string = 'index';
  public readonly describe: string = 'Run log indexer that indies contract logs';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    // default
    let configs: Array<IndexConfig> = LogindexConfigs;

    if (argv.config) {
      try {
        configs = JSON.parse(fs.readFileSync(argv.config).toString());
      } catch (e: any) {
        console.log(`failed to read config file ${argv.config} error ${e.message}`);
        process.exit(0);
      }
    }

    const services = await super.getServices();
    const logindex = new LogIndexer(services, configs);

    const chain = argv.chain;
    const address = argv.address ? normalizeAddress(argv.address) : undefined;
    const fromBlock = argv.fromBlock ? Number(argv.fromBlock) : 0;
    while (true) {
      await logindex.run({ chain, address, fromBlock });

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(5 * 50);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      chain: {
        type: 'string',
        default: 'ethereum',
        describe:
          'Index logs from given blockchain, supported: ethereum, arbitrum, base, polygon, optimism, bnbchain, avalanche.',
      },
      address: {
        type: 'string',
        default: '',
        describe: 'Index logs from given initial block number.',
      },
      fromBlock: {
        type: 'number',
        default: 0,
        describe: 'Index logs from given initial block number.',
      },
      config: {
        type: 'string',
        default: '',
        describe: 'Path to JSON file contains a list of contract index configs.',
      },
      exit: {
        type: 'boolean',
        default: 0,
        describe: 'Exit when indexing to latest block, do not loop.',
      },
    });
  }
}
