import envConfig from '../configs/envConfig';
import { MongoService } from '../services/mongo';
import { OracleService } from '../services/oracle';
import { Web3Service } from '../services/web3';
import { ContextServices } from '../types/namespaces';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getServices(): Promise<ContextServices> {
    const mongo = new MongoService();
    const mongoServe = new MongoService();
    const web3 = new Web3Service();
    const oracle = new OracleService(mongo, web3);

    const providers: ContextServices = {
      mongo: mongo,
      mongoServe: mongoServe,
      web3: web3,
      oracle: oracle,
    };

    await providers.mongo.connect(envConfig.mongo.connectionUri, envConfig.mongo.databaseName);
    await providers.mongoServe.connect(envConfig.mongo.connectionUriServe, envConfig.mongo.databaseName);

    return providers;
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
