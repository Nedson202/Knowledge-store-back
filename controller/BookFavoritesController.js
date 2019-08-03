import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch/elasticSearch';
import {
  authStatusPermission, favoriteBookLabel, addedToFavoriteMessage,
  bookExistInFavorites, bookRemovedFromFavorites
} from '../utils/default';

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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const retrievedBook = await retrieveBook(newData.bookId);
      await BookController.addBookIfNotExist(retrievedBook);
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      const favorite = await models.Favorite.findOne({
        where: {
          bookId: newData.bookId
        }
      });
      if (favorite) throw new Error(bookExistInFavorites);
      await models.Favorite.create(newData);
      return {
        message: addedToFavoriteMessage
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
  static async checkFavorite(bookId) {
    try {
      const favorite = await models.Favorite.findOne({
        where: {
          bookId
        }
      });
      if (favorite) return true;
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
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async getFavorites(authStatus) {
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      const books = await models.Favorite.findAll({
        where: {
          userId: id
        },
        include: [{
          model: models.Book,
          as: favoriteBookLabel,
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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      await models.Favorite.destroy({
        where: {
          userId: id,
          bookId: books,
        },
      });
      return {
        message: bookRemovedFromFavorites
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookFavoritesController;
