import { stackLogger } from 'info-logger';
import { addDataToRedis, getDataFromRedis } from '../redis';
import GenreRepository from '../repository/Genre';

const genreRepository = new GenreRepository();

class GenreController {
  /**
   *
   *
   * @static
   * @returns
   * @memberof GenreController
   */
  static async getGenres() {
    try {
      const redisKey = 'book::::genres';
      let bookGenres = await getDataFromRedis(redisKey) || [];

      if (!bookGenres.length) {
        bookGenres = await genreRepository.getAll();

        addDataToRedis(redisKey, bookGenres);
      }

      return bookGenres;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default GenreController;
