import { stackLogger } from 'info-logger';

import FavoritesRepository from '../repository/Favorite';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch';
import {
  ADDED_TO_FAVORITE, BOOK_REMOVED_FROM_FAVORITES
} from '../settings/default';
import utils from '../utils';
import authStatusCheck from '../utils/authStatusCheck';

const { helper } = utils;
const favoritesRepository = new FavoritesRepository();

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
    authStatusCheck(authStatus);

    const newData = data;
    try {
      const retrievedBook = await retrieveBook(newData.bookId);

      await BookController.addBookIfNotExist(retrievedBook, newData.bookId);

      const isDeleted = await BookFavoritesController
        .deleteFavoriteIfExists(data, authStatus);

      if (!isDeleted) {
        await favoritesRepository.create(newData);
      }

      return {
        message: ADDED_TO_FAVORITE
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }


  static async deleteFavoriteIfExists(data, authStatus) {
    const newData = data;
    try {
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      const queryObject = {
        bookId: newData.bookId,
        userId: authStatus.id,
      };
      const favorite = await favoritesRepository.findOne(queryObject);

      if (favorite) {
        await favoritesRepository.deleteOne(queryObject);

        return true;
      }

      return false;
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
      const queryObject = {
        bookId,
        userId: id,
      };
      const favorite = await favoritesRepository.findOne(queryObject);

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
      const books = await favoritesRepository.getFavoriteBooks({
        userId: id,
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

      await favoritesRepository.deleteMany({
        userId: id,
      }, { bookId: books, });

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
