import redis from 'redis';
import logger from '../utils/initLogger';
import { PRODUCTION } from '../settings';

class Redis {
  constructor() {
    this.redisClient = {};

    this.createClient();
  }

  /**
   *
   *
   * @returns
   * @memberof Redis
   */
  getHost() {
    return process.env.NODE_ENV.match(PRODUCTION)
      ? process.env.REDIS_URL : process.env.REDIS_LOCAL;
  }

  /**
   *
   * @memberof Redis
   */
  createClient() {
    const redisClient = redis.createClient(this.getHost());

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.info(`Something went wrong: ${err}`);
    });

    this.redisClient = redisClient;
  }

  /**
   *
   * @param {string} key - redis data key
   * @param {*} value - value to store
   * @memberof Redis
   */
  addDataToRedis = (key, value) => {
    this.redisClient.set(key, JSON.stringify(value), (err) => {
      if (err) {
        logger.warn(err);
        throw err;
      }
      logger.info('Data added to redis store');
    });
  };

  /**
   *
   * @param {string} key - redis data key
   * @memberof Redis
   */
  getDataFromRedis = async key => new Promise((resolve, reject) => {
    this.redisClient.get(key, (err, result) => {
      if (err) {
        reject(err);
        logger.warn(err);
      }

      resolve(JSON.parse(result));
    });
  })
}

export default Redis;
