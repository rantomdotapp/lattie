import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { CollectCommand } from './cmd/collect';
import { ServeCommand } from './cmd/serve';
import { TestCommand } from './cmd/test';
import { UpdateCommand } from './cmd/update';

(async function () {
  dotenv.config();

  const serveCmd = new ServeCommand();
  const collectCmd = new CollectCommand();
  const updateCmd = new UpdateCommand();
  const testCmd = new TestCommand();

  yargs(process.argv.slice(2))
    .scriptName('lattie')
    .command(serveCmd.name, serveCmd.describe, serveCmd.setOptions, serveCmd.execute)
    .command(collectCmd.name, collectCmd.describe, collectCmd.setOptions, collectCmd.execute)
    .command(updateCmd.name, updateCmd.describe, updateCmd.setOptions, updateCmd.execute)
    .command(testCmd.name, testCmd.describe, testCmd.setOptions, testCmd.execute)
    .help().argv;
})();
