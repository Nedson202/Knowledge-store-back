import redis from 'redis';
import logger from '../utils/initLogger';

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.info(`Something went wrong: ${err}`);
});

export const addDataToRedis = (key, value) => {
  redisClient.set(key, JSON.stringify(value), (err) => {
    if (err) {
      logger.warn(err);
      throw err;
    }
    logger.info('Data added to redis store');
  });
};

export const getDataFromRedis = async key => new Promise((resolve, reject) => {
  redisClient.get(key, (err, result) => {
    if (err) {
      reject(err);
      logger.warn(err);
    }
    resolve(JSON.parse(result));
  });
});

export default redisClient;
