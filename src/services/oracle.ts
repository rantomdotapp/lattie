import { OracleChainlinkConfigs, OracleConfigs } from '../configs';
import EnvConfig from '../configs/envConfig';
import { OracleChainlinkConfigBases } from '../configs/oracles/chainlink';
import logger from '../lib/logger';
import { getStartDayTimestamp, sleep } from '../lib/utils';
import { ChainlinkOracleLib } from '../modules/oracles/libs/chainlink';
import { UniswapOracleLib } from '../modules/oracles/libs/uniswap';
import { OracleChainlink, OracleConfig, OraclePool2 } from '../types/configs';
import { IMongoService, IOracleService, IWeb3Service } from '../types/namespaces';
import { Memcache } from './memcache';

export class OracleService extends Memcache implements IOracleService {
  public readonly name: string = 'oracle';
  public readonly web3: IWeb3Service;
  public readonly mongo: IMongoService | null = null;

  constructor(mongo: IMongoService | null, web3: IWeb3Service) {
    // initialize memory cache
    super();

    this.mongo = mongo;
    this.web3 = web3;
  }

  // this function don't care the quote token is any
  // just return how many base token per quote token
  // or return the latest answer if it is chainlink oracle
  private async getOracleQuotePrice(config: OracleConfig, blockNumber: number): Promise<number> {
    const cacheKey = `oracle-${config.type}-${config.chain}-${config.address}-${blockNumber}`;
    const cacheData = this.get(cacheKey);
    if (cacheData) {
      return cacheData;
    }

    let quotePrice = 0;
    try {
      switch (config.type) {
        case 'chainlink': {
          quotePrice = await ChainlinkOracleLib.getSpotPrice(this.web3, {
            ...(config as OracleChainlink),
            blockNumber: blockNumber,
          });
          break;
        }
        case 'univ2': {
          quotePrice = await UniswapOracleLib.getSpotPriceV2(this.web3.getProvider(config.chain), {
            ...(config as OraclePool2),
            blockNumber: blockNumber,
          });
          break;
        }
        case 'univ3': {
          quotePrice = await UniswapOracleLib.getSpotPriceV3(this.web3.getProvider(config.chain), {
            ...(config as OraclePool2),
            blockNumber: blockNumber,
          });
          break;
        }
      }

      if (quotePrice !== 0) {
        this.set(cacheKey, quotePrice);
      }
    } catch (e: any) {
      logger.debug('failed to get oracle quote price', {
        service: this.name,
        chain: config.chain,
        type: config.type,
        address: config.address,
        error: e.message,
      });
    }

    // at the end, return zero
    return quotePrice;
  }

  // this function get quote price from oracle source
  // if the source is not chainlink, it gets quote price of oracle source quote token
  // example, we have a uniswap v2 pool of AAVE-WETH
  // to get AAVE price in usd, we first get AAVE price in WETH
  // we also need to get WETH price in USD
  // AAVE price = AAVE price in WETH * WETH price in USD
  private async getOracleSpotPrice(chain: string, address: string, timestamp: number): Promise<number> {
    const configKey = `${chain}:${address}`;
    if (!OracleChainlinkConfigs[configKey] && !OracleConfigs[configKey]) {
      logger.warn('failed to get oracle config', {
        service: this.name,
        chain: chain,
        address: address,
      });
      return 0;
    }

    const cacheKey = `price-${chain}-${address}-${timestamp}`;
    const cacheData = this.get(cacheKey);
    if (cacheData) {
      return Number(cacheData);
    }

    let blockNumber = 0;
    while (blockNumber === 0) {
      blockNumber = await this.web3.getBlockAtTimestamp(chain, timestamp);
      if (blockNumber === 0) {
        logger.warn('failed to get block number', {
          service: this.name,
          chain: chain,
          timestamp: timestamp,
        });
      }

      await sleep(5);
    }

    let returnPrice = 0;

    // first, we try with chainlink oracle source if any
    if (OracleChainlinkConfigs[configKey]) {
      // it is also price in USD
      returnPrice = await this.getOracleQuotePrice(OracleChainlinkConfigs[configKey], blockNumber);
    }

    if (returnPrice === 0) {
      const config: OracleConfig = OracleConfigs[configKey];

      // try with config source
      const quotePrice = await this.getOracleQuotePrice(config, blockNumber);
      if (OracleConfigs[configKey].type !== 'chainlink') {
        const quoteTokenOracleConfig: OracleConfig =
          OracleConfigs[`${(config as OraclePool2).quoteToken.chain}:${(config as OraclePool2).quoteToken.address}`];
        if (!quoteTokenOracleConfig) {
          logger.warn('failed to get oracle config for quote token', {
            service: this.name,
            chain: (config as OraclePool2).quoteToken.chain,
            address: (config as OraclePool2).quoteToken.address,
          });
        } else {
          const quoteTokenPriceUSD = await this.getOracleQuotePrice(quoteTokenOracleConfig, blockNumber);
          returnPrice = quotePrice * quoteTokenPriceUSD;
        }
      } else {
        // this is also USD price
        returnPrice = quotePrice;
      }
    }

    if (returnPrice !== 0) {
      this.set(cacheKey, returnPrice);
    }

    return returnPrice;
  }

  public async getTokenPriceUSD(chain: string, address: string, timestamp: number): Promise<number> {
    // the timestamp is always UTC day timestamp
    timestamp = getStartDayTimestamp(timestamp);

    // firstly, we find price in database
    if (this.mongo) {
      const oraclePricesCollection = await this.mongo.getCollection(EnvConfig.mongo.collections.oraclePrices);

      const prices: Array<any> = await oraclePricesCollection
        .find({
          chain: chain,
          address: address,
          timestamp: timestamp,
        })
        .toArray();
      if (prices.length > 0) {
        if (prices[0].priceUSD && Number(prices[0].priceUSD) > 0) return Number(prices[0].priceUSD);
      }
    }

    const priceUSD = await this.getOracleSpotPrice(chain, address, timestamp);

    if (priceUSD !== 0) {
      // save to database
      if (this.mongo) {
        const oraclePricesCollection = await this.mongo.getCollection(EnvConfig.mongo.collections.oraclePrices);

        await oraclePricesCollection.updateOne(
          {
            chain: chain,
            address: address,
            timestamp: timestamp,
          },
          {
            $set: {
              chain: chain,
              address: address,
              timestamp: timestamp,
              priceUSD: priceUSD,
            },
          },
          {
            upsert: true,
          },
        );
      }
    } else {
      logger.warn('failed to get token price', {
        service: this.name,
        chain: chain,
        address: address,
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
      });
    }

    return priceUSD;
  }
}
