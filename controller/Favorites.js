import { stackLogger } from 'info-logger';

import FavoritesRepository from '../repository/Favorite';
import Book from './Book';
import ElasticSearch from '../elasticSearch';
import {
  ADDED_TO_FAVORITE, BOOK_REMOVED_FROM_FAVORITES
} from '../settings';
import Utils from '../utils';
import authStatusCheck from '../utils/authStatusCheck';
import Redis from '../redis';

const favoritesRepository = new FavoritesRepository();
const redis = new Redis();
const elasticSearch = new ElasticSearch();

class Favorites {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof Favorites
   */
  static async addToFavorites(data, authStatus) {
    authStatusCheck(authStatus);

    const newData = data;
    try {
      const retrievedBook = await elasticSearch.retrieveBook(newData.bookId);

      const response = await Book
        .addBookIfNotExist(retrievedBook, newData.bookId);

      const isDeleted = await Favorites
        .deleteFavoriteIfExists(data, authStatus);

      await Favorites.toggleFavoriteInRedis(
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

    const previousCache = await redis.getDataFromRedis(redisKey) || [];

    if (!isFavoriteDeleted) {
      const combinedData = [cacheBook, ...previousCache];

      redis.addDataToRedis(redisKey, combinedData);

      return;
    }

    const cleanCache = previousCache.filter((cacheData) => {
      if (cacheData.id && cacheData.id !== cacheBook.id) {
        return true;
      }

      return false;
    });

    redis.addDataToRedis(redisKey, cleanCache);
  }

  static async deleteFavoriteIfExists(data, authStatus) {
    const newData = data;
    try {
      newData.id = Utils.generateId();
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
   * @memberof Favorites
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
   * @memberof Favorites
   */
  static async getFavorites(authStatus) {
    try {
      authStatusCheck(authStatus);

      const redisKey = `Book-Favorites-${authStatus.id}`;

      let bookData = await redis.getDataFromRedis(redisKey) || [];
      bookData = bookData.filter(book => book.id);

      if (!bookData.length) {
        const { id } = authStatus;

        bookData = await favoritesRepository.getFavoriteBooks({
          userId: id,
        });
      }

      if (!bookData.length) return [];

      redis.addDataToRedis(authStatus.id, bookData);

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
   * @memberof Favorites
   */
  static async removeFavorites(data, authStatus) {
    const { books } = data;
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;

      await favoritesRepository.deleteMany({
        userId: id,
      }, { bookId: books, });

      await Favorites.removeFavoritesFromRedis(id, books);

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

    const previousCache = await redis.getDataFromRedis(redisKey) || [];

    const previousCacheSET = new Set(previousCache);
    const booksToRemove = new Set(books);

    const cacheIntersection = [...new Set(
      [...previousCacheSET].filter(bookData => !booksToRemove.has(bookData.id))
    )];

    redis.addDataToRedis(redisKey, cacheIntersection);
  }
}

export default Favorites;
