import redis from 'redis';
import { loggerInstance as logger } from '../logger';

class Redis {
  constructor() {
    this.redisClient = {};

    this.createClient();
  }

  /**
   *
   * @memberof Redis
   */
  createClient() {
    const redisClient = redis.createClient(process.env.REDIS_URL);

    redisClient.on('connect', () => {
      logger.info('Redis:createClient: Redis client connected --');
    });

    redisClient.on('error', (err) => {
      logger.info(`Redis:createClient: Something went wrong: ${err} --`);
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
    if (!value) {
      logger.warn('Redis:addDataToRedis: Value is not defined');

      return;
    }

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
        logger.warn(`Redis:getDataFromRedis: ${err}`);
      }

      if (result !== 'undefined') {
        resolve(JSON.parse(result));
      }

      resolve(null);
    });
  })
}

export const redisInstance = new Redis();

export default Redis;
