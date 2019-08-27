import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch';
import {
  FAVORITE_BOOK_LABEL, ADDED_TO_FAVORITE, BOOK_REMOVED_FROM_FAVORITES
} from '../settings/default';
import authStatusCheck from '../utils/authStatusCheck';

const { helper } = utils;

class BookFavoritesController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async addToFavorites(data, authStatus) {
    const newData = data;
    try {
      authStatusCheck(authStatus);
      const retrievedBook = await retrieveBook(newData.bookId);
      await BookController.addBookIfNotExist(retrievedBook);
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      const favorite = await models.Favorite.findOne({
        where: {
          bookId: newData.bookId
        }
      });
      if (favorite) {
        await favorite.destroy();

        return {
          message: BOOK_REMOVED_FROM_FAVORITES,
        };
      }
      await models.Favorite.create(newData);
      return {
        message: ADDED_TO_FAVORITE
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof BookFavoritesController
   */
  static async checkFavorite(bookId, authStatus) {
    try {
      if (!authStatus) {
        return false;
      }
      const { id } = authStatus;
      const favorite = await models.Favorite.findOne({
        where: {
          bookId,
          userId: id,
        }
      });
      if (favorite) return true;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async getFavorites(authStatus) {
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;
      const books = await models.Favorite.findAll({
        where: {
          userId: id
        },
        include: [{
          model: models.Book,
          as: FAVORITE_BOOK_LABEL,
        }]
      }).map((value) => {
        value.get({ plain: true });
        return value.favoriteBook;
      });
      if (!books.length) return [];
      return books;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async removeFavorites(data, authStatus) {
    const { books } = data;
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;
      await models.Favorite.destroy({
        where: {
          userId: id,
          bookId: books,
        },
      });
      return {
        message: BOOK_REMOVED_FROM_FAVORITES
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookFavoritesController;
