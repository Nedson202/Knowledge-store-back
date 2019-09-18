import googleBooks from 'google-books-search';
import {
  elasticItemSearch, elasticBulkCreate, retrieveBook, addDocument
} from '../elasticSearch';
import utils from '../utils';
import { BOOK_LABEL, GOOGLE_BOOK_OPTIONS } from '../settings/default';
import BookController from './BookController';
import { addDataToRedis, getDataFromRedis } from '../redis';

const { helper } = utils;

class GoogleBooks {
  /**
   *
   *
   * @static
   * @param {*} searchQuery
   * @returns
   * @memberof GoogleBooks
   */
  static async searchBooks(searchQuery) {
    const options = GOOGLE_BOOK_OPTIONS;

    let query;

    try {
      const awaitResult = await new Promise(((resolve, reject) => googleBooks
        .search(searchQuery, options, (error, results, apiResponse) => {
          if (error) reject(error);
          if (!apiResponse) return resolve([]);
          query = apiResponse.items.map((result) => {
            const {
              id,
              volumeInfo: {
                title, description, authors, pageCount,
                averageRating, publishedDate, categories, imageLinks
              },
              accessInfo: {
                epub: { downloadLink }, pdf: { downloadLink: pdfDownloadLink }
              }
            } = result;
            return {
              id: id || helper.generateId(),
              name: title,
              description,
              image: imageLinks && (imageLinks.thumbnail || imageLinks.large || ''),
              authors: authors || [],
              pageCount,
              googleAverageRating: averageRating,
              year: publishedDate || '',
              genre: categories || [],
              downloadable: [
                downloadLink,
                pdfDownloadLink
              ]
            };
          });
          if (apiResponse) {
            elasticBulkCreate(query);

            resolve(query);
          }
        })));
      return awaitResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} searchQuery
   * @param {*} paginateData
   * @returns
   * @memberof GoogleBooks
   */
  static async completeSearch(searchQuery, paginateData) {
    try {
      const redisKey = `${searchQuery}:::${JSON.stringify(paginateData)}`;
      let searchResult = await getDataFromRedis(redisKey) || [];
      if (!searchResult.length) {
        searchResult = await elasticItemSearch(searchQuery, paginateData) || [];
        if (searchResult.length) addDataToRedis(redisKey, searchResult);
      }
      if (!searchResult.length) {
        searchResult = await GoogleBooks.searchBooks(searchQuery || 'random');
        if (searchResult.length) addDataToRedis(redisKey, searchResult);
      }

      if (!searchResult.length) {
        return [];
      }

      const randomizeSearch = GoogleBooks.randomizeResult(searchResult);

      return randomizeSearch;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof GoogleBooks
   */
  static async retrieveMoreBooks(bookId) {
    try {
      let more;
      const redisKey = `${bookId}:::more-books`;
      more = await getDataFromRedis(redisKey) || [];
      if (more.length) {
        const randomizedData = GoogleBooks.randomizeResult(more);

        return randomizedData.slice(0, 4);
      }

      const searchResult = await GoogleBooks.retrieveBookProfile(bookId);
      if (searchResult) {
        const { name, name: mainBookName } = searchResult;
        const moreBooks = await GoogleBooks.searchBooks(name);
        if (moreBooks.length > 0) {
          const filterBooks = moreBooks.filter(book => book.name !== mainBookName);
          more = GoogleBooks.randomizeResult(filterBooks);
        }
        addDataToRedis(redisKey, more);

        return more.slice(0, 4);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof GoogleBooks
   */
  static async retrieveBookProfile(bookId) {
    try {
      const redisKey = JSON.stringify(bookId);
      let searchResult = await getDataFromRedis(redisKey) || {};

      if (!searchResult.id) {
        // query elasticsearch
        searchResult = await retrieveBook(bookId);
        addDataToRedis(redisKey, searchResult);
      }
      if (!searchResult) {
        // query pg database
        searchResult = await BookController.getBook(bookId);
        if (searchResult) {
          // add document to elasticsearch and redis
          addDocument(searchResult, BOOK_LABEL);
          addDataToRedis(redisKey, searchResult);
        }
      }

      // await BookController.getDownloadURL(searchResult.name);

      return searchResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} array
   * @returns
   * @memberof GoogleBooks
   */
  static randomizeResult(array) {
    const arrayToShuffle = array;
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      arrayToShuffle[currentIndex] = array[randomIndex];
      arrayToShuffle[randomIndex] = temporaryValue;
    }

    return arrayToShuffle;
  }
}

export default GoogleBooks;
