import { Collection, MongoClient } from 'mongodb';

import envConfig from '../configs/envConfig';
import logger from '../lib/logger';
import { sleep } from '../lib/utils';
import { IMongoService } from '../types/namespaces';

export class MongoService implements IMongoService {
  public readonly name: string = 'mongo';

  // used to store mongo connection status
  private _connected: boolean = false;

  // the mongo db client
  private _client: MongoClient | null = null;

  // the mongo main database
  private _db: any = null;

  constructor() {}

  public async connect(url: string, name: string): Promise<void> {
    if (!this._connected) {
      this._client = new MongoClient(url);

      while (!this._connected) {
        try {
          await this._client?.connect();
          this._db = this._client?.db(name);
          this._connected = true;

          // setup indies
          await this.setupIndies();

          logger.info('success to connect to mongo', {
            service: this.name,
            name: name,
          });
        } catch (e: any) {
          logger.error('failed to connect to mongo', {
            service: this.name,
            name: name,
            error: e.message,
          });
          await sleep(5);
        }
      }
    }
  }

  public async getCollection(name: string): Promise<Collection> {
    let collection: Collection | null = null;
    if (this._connected) {
      collection = this._db ? this._db.collection(name) : null;
    } else {
      logger.error('failed to get collection from mongo', {
        service: this.name,
        collection: name,
      });
      process.exit(1);
    }

    if (!collection) {
      logger.error('failed to get collection from mongo', {
        service: this.name,
        collection: name,
      });
      process.exit(1);
    }

    return collection;
  }

  private async setupIndies() {
    const metricsCollection = await this.getCollection(envConfig.mongo.collections.metrics);
    const oraclePricesCollection = await this.getCollection(envConfig.mongo.collections.oraclePrices);

    metricsCollection.createIndex({ protocol: 1, metric: 1, timestamp: 1 }, { background: true });
    metricsCollection.createIndex({ protocol: 1, 'token.address': 1, timestamp: 1 }, { background: true });
    oraclePricesCollection.createIndex({ chain: 1, address: 1, timestamp: 1 }, { background: true });
  }
}
