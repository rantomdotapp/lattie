import { normalizeAddress, sleep } from '../lib/utils';
import { LogIndexer } from '../modules/logindex/indexer';
import { BasicCommand } from './basic';

export class LogindexCommand extends BasicCommand {
  public readonly name: string = 'index';
  public readonly describe: string = 'Run log indexer that indies contract logs';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const mode = argv.mode;
    if (mode === 'single' || mode === 'network') {
      const services = await super.getServices();
      const logindex = new LogIndexer(services);

      if (mode === 'single') {
        const chain = argv.chain;
        const address = normalizeAddress(argv.address);
        const fromBlock = argv.fromBlock ? Number(argv.fromBlock) : 0;
        while (true) {
          await logindex.run({ chain, address, fromBlock });

          if (argv.exit) {
            process.exit(0);
          }

          await sleep(5 * 50);
        }
      } else {
        const chain = argv.chain;
        const fromBlock = argv.fromBlock ? Number(argv.fromBlock) : 0;
        while (true) {
          await logindex.run({ chain, address: undefined, fromBlock });

          if (argv.exit) {
            process.exit(0);
          }

          await sleep(5 * 50);
        }
      }
    } else {
      console.log(`mode ${mode} is not supported`);
      process.exit(0);
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
      mode: {
        type: 'string',
        default: 'network',
        describe: 'The worker mode: single or network, default: network.',
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
      exit: {
        type: 'boolean',
        default: 0,
        describe: 'Exit when indexing to latest block, do not loop.',
      },
    });
  }
}
