import { stackLogger } from 'info-logger';

import FavoritesRepository from '../repository/Favorite';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch';
import {
  ADDED_TO_FAVORITE, BOOK_REMOVED_FROM_FAVORITES
} from '../settings/default';
import utils from '../utils';
import authStatusCheck from '../utils/authStatusCheck';
import { addDataToRedis, getDataFromRedis } from '../redis';

const { helper } = utils;
const favoritesRepository = new FavoritesRepository();

class FavoritesController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof FavoritesController
   */
  static async addToFavorites(data, authStatus) {
    authStatusCheck(authStatus);

    const newData = data;
    try {
      const retrievedBook = await retrieveBook(newData.bookId);

      const response = await BookController
        .addBookIfNotExist(retrievedBook, newData.bookId);

      const isDeleted = await FavoritesController
        .deleteFavoriteIfExists(data, authStatus);

      await FavoritesController.toggleFavoriteInRedis(
        response, isDeleted, authStatus.id
      );

      if (!isDeleted) {
        await favoritesRepository.create(newData);

        return {
          message: ADDED_TO_FAVORITE
        };
      }
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async toggleFavoriteInRedis(cacheBook, isFavoriteDeleted, userId) {
    const redisKey = `Book-Favorites-${userId}`;

    const previousCache = await getDataFromRedis(redisKey) || [];

    if (!isFavoriteDeleted) {
      const combinedData = [cacheBook, ...previousCache];

      addDataToRedis(redisKey, combinedData);

      return;
    }

    const cleanCache = previousCache.filter(cacheData => cacheData.id !== cacheBook.id);

    addDataToRedis(redisKey, cleanCache);
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
   * @memberof FavoritesController
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
   * @memberof FavoritesController
   */
  static async getFavorites(authStatus) {
    try {
      authStatusCheck(authStatus);

      const redisKey = `Book-Favorites-${authStatus.id}`;

      let bookData = await getDataFromRedis(redisKey);

      if (!bookData.length) {
        const { id } = authStatus;

        bookData = await favoritesRepository.getFavoriteBooks({
          userId: id,
        });
      }

      if (!bookData.length) return [];

      addDataToRedis(authStatus.id, bookData);

      return bookData;
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
   * @memberof FavoritesController
   */
  static async removeFavorites(data, authStatus) {
    const { books } = data;
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;

      await favoritesRepository.deleteMany({
        userId: id,
      }, { bookId: books, });

      await FavoritesController.removeFavoritesFromRedis(id, books);

      return {
        message: BOOK_REMOVED_FROM_FAVORITES
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async removeFavoritesFromRedis(userId, books) {
    const redisKey = `Book-Favorites-${userId}`;

    const previousCache = await getDataFromRedis(redisKey) || [];

    const previousCacheSET = new Set(previousCache);
    const booksToRemove = new Set(books);

    const cacheIntersection = [...new Set(
      [...previousCacheSET].filter(bookData => !booksToRemove.has(bookData.id))
    )];

    addDataToRedis(redisKey, cacheIntersection);
  }
}

export default FavoritesController;
