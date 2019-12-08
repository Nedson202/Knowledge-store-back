import { stackLogger } from 'info-logger';
import Redis from '../redis';
import GenreRepository from '../repository/Genre';

const genreRepository = new GenreRepository();
const redis = new Redis();

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
      stackLogger(error);
      return error;
    }
  }
}

export default Genre;
