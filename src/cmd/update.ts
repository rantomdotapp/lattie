import { Updater } from '../modules/updater/updater';
import { BasicCommand } from './basic';

export class UpdateCommand extends BasicCommand {
  public readonly name: string = 'update';
  public readonly describe: string = 'Run configs and static data updater';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const updater = new Updater();
    await updater.run();
  }

  public setOptions(yargs: any) {
    return yargs.option({});
  }
}
