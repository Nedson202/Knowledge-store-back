import { loggerInstance as logger } from '../logger';
import { redisInstance as redis } from '../redis';
import GenreRepository from '../repository/Genre';

const genreRepository = new GenreRepository();

class Genre {
  /**
   *
   *
   * @static
   * @returns
   * @memberof Genre
   */
  static async getGenres() {
    try {
      const redisKey = 'book::::genres';
      let bookGenres = await redis.getDataFromRedis(redisKey) || [];

      if (!bookGenres.length) {
        bookGenres = await genreRepository.getAll();

        redis.addDataToRedis(redisKey, bookGenres);
      }

      return bookGenres;
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  }
}

export default Genre;
