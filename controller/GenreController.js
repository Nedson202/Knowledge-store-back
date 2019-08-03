import { stackLogger } from 'info-logger';
import models from '../models';
import { genreOrder } from '../utils/default';

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
      return await models.Genre.findAll({
        order: [genreOrder]
      });
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default GenreController;
