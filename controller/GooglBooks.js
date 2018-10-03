import googleBooks from 'google-books-search';
import models from '../models';
import {
  elasticItemSearch, elasticBulkCreate, retrieveBook, addDocument
} from '../helper/elasticSearch';
import utils from '../utils';

const { helper } = utils;

class GoogleBooks {
  static async searchBooks(searchQuery) {
    const options = {
      key: 'AIzaSyC45ziFKQRFb7yefGvWgcqyC3JwQ9HLKJc',
      field: 'title',
      offset: 0,
      limit: 40,
      zoom: 0,
      type: 'books',
      order: 'relevance',
      lang: 'en'
    };

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

  static async completeSearch(searchQuery, paginateData) {
    try {
      const searchResult = await elasticItemSearch(searchQuery, paginateData);

      if (!searchResult.length) {
        return await GoogleBooks.searchBooks(searchQuery);
      }
      return searchResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async retrieveSingleBook(bookId) {
    try {
      let more;
      const searchResult = await GoogleBooks.retrieveBookProfile(bookId);
      // const searchResult = await retrieveBook(bookId);
      if (searchResult) {
        const { name, name: mainBookName } = searchResult;
        const moreBooks = await GoogleBooks.searchBooks(name);
        if (moreBooks.length > 0) {
          const filterBooks = moreBooks.filter(book => book.name !== mainBookName);
          more = GoogleBooks.randomizeResult(filterBooks);
        }
      }
      return more;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async retrieveBookProfile(bookId) {
    try {
      let searchResult;
      searchResult = await retrieveBook(bookId);
      if (!searchResult) {
        const result = await models.Book.findById(bookId);
        searchResult = result.dataValues;
        if (searchResult) addDocument(searchResult, 'book');
      }
      return searchResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  static randomizeResult(array) {
    const arrayToShuffle = array;
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      arrayToShuffle[currentIndex] = array[randomIndex];
      arrayToShuffle[randomIndex] = temporaryValue;
    }
    arrayToShuffle.splice(4);
    return arrayToShuffle;
  }
}

export default GoogleBooks;
