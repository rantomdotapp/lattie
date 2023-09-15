import { MasterchefConfigs } from '../configs/masterchef';
import { getTimestamp, sleep } from '../lib/utils';
import { getTerminalWithConfig } from '../modules/terminal/manager';
import { MasterchefConfig } from '../types/configs';
import { ITerminal } from '../types/namespaces';
import { BasicCommand } from './basic';

export class TerminalCommand extends BasicCommand {
  public readonly name: string = 'terminal';
  public readonly describe: string = 'Run terminal worker that collects protocol users data';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services = await super.getServices();

    const metric = argv.metric;
    if (['lending', 'masterchef'].indexOf(metric) === -1) {
      console.error(`Do not support metric ${metric}`);
      process.exit(0);
    }

    let configs: Array<MasterchefConfig> = [];
    if (metric === 'masterchef') {
      if (argv.protocol !== '') {
        configs = MasterchefConfigs.filter((item) => item.protocol === argv.protocol);
      } else {
        configs = MasterchefConfigs;
      }
    }

    while (true) {
      for (const config of configs) {
        const terminal: ITerminal | null = getTerminalWithConfig(services, {
          metric: metric,
          config: config,
        });
        if (terminal) {
          await terminal.run();
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
        default: '', // get all users data
        describe: 'The metric to collect [lending, masterchef], default all.',
      },
      protocol: {
        type: 'string',
        default: '', // get all users of all protocols
        describe: 'The protocol to collect data, default all.',
      },
      exit: {
        type: 'boolean',
        default: false,
        describe: 'Do not run as daemon, exit when done to get all snapshots.',
      },
    });
  }
}
