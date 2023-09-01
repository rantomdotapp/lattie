import { LendingMarketConfigs } from '../configs/lending';
import { sleep } from '../lib/utils';
import { getCollectorWithConfig } from '../modules/collector/manager';
import { LendingMarketConfig } from '../types/configs';
import { ICollector } from '../types/namespaces';
import { BasicCommand } from './basic';

export class CollectCommand extends BasicCommand {
  public readonly name: string = 'collect';
  public readonly describe: string = 'Run worker that collects protocol metrics';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services = await super.getServices();

    const metric = argv.metric;
    if (['liquidity', 'lending'].indexOf(metric) === -1) {
      console.error(`Do not support metric ${metric}`);
      process.exit(0);
    }

    let configs: Array<LendingMarketConfig> = [];
    if (metric === 'lending') {
      if (argv.protocol !== '') {
        configs = LendingMarketConfigs.filter((item) => item.protocol === argv.protocol);
      } else {
        configs = LendingMarketConfigs;
      }
    }

    while (true) {
      for (const config of configs) {
        const collector: ICollector | null = getCollectorWithConfig(services, {
          metric: metric,
          config: config,
          fromTime: argv.fromTime ? Number(argv.fromTime) : 0,
        });
        if (collector) {
          await collector.run();
        }
      }

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(5 * 60);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      metric: {
        type: 'string',
        default: '', // collect all metrics
        describe: 'The metric to collect [lending, liquidity], default all.',
      },
      protocol: {
        type: 'string',
        default: '', // collect all protocols
        describe: 'The protocol to collect data, default all.',
      },
      fromTime: {
        type: 'number',
        default: 0, // set the initial timestamp to sync data
        describe: 'The initial timestamp to sync data.',
      },
      exit: {
        type: 'boolean',
        default: false,
        describe: 'Do not run as daemon, exit when done to get all snapshots.',
      },
    });
  }
}
