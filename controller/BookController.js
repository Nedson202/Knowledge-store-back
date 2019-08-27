import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import { addDocument } from '../elasticSearch';
import authStatusCheck from '../utils/authStatusCheck';
import {
  BOOK_LABEL, BOOK_REVIEWS_LABEL, NO_BOOK_MESSAGE,
  BOOK_UPDATED_MESSAGE, NO_BOOK_CREATED, BOOK_DELETED_MESSAGE,
  PERMISSION_DENIED, NO_BOOK_FOUND
} from '../settings/default';

const { helper, validator } = utils;

class BookController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof BookController
   */
  static async addBook(data, authStatus) {
    const newData = data;
    newData.id = helper.generateId();
    newData.userId = authStatus.id;
    const errors = validator.validateAddBook({
      ...newData
    });
    try {
      authStatusCheck(authStatus);
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const createdBook = await models.Book.create(newData);
      addDocument(newData, BOOK_LABEL);
      return createdBook;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} book
   * @memberof BookController
   */
  static async addBookIfNotExist(book) {
    await models.Book.findOrCreate({
      where: {
        id: book.id
      },
      defaults: book
    });
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof BookController
   */
  static async getBooks() {
    try {
      const books = await models.Book.findAll({
        include: [{
          model: models.Review,
          as: BOOK_REVIEWS_LABEL,
        }]
      });
      if (!books.length) throw new Error(NO_BOOK_MESSAGE);
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
   * @param {*} reviews
   * @returns
   * @memberof BookController
   */
  static calculateBookRatings(reviews) {
    try {
      const totalReviews = reviews.length;
      const averageRating = totalReviews
        && reviews
          .reduce((totalRating, value) => totalRating + value.dataValues.rating, 0)
        / totalReviews;
      return averageRating || 0;
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
   * @memberof BookController
   */
  static async getUsersBooks(authStatus) {
    try {
      authStatusCheck(authStatus);
      const usersBooks = await models.Book.findAll({
        where: {
          userId: authStatus.id
        }
      });
      if (!usersBooks) throw new Error(NO_BOOK_CREATED);
      return usersBooks;
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
   * @memberof BookController
   */
  static async getBook(bookId) {
    try {
      const book = await models.Book.findOne({
        where: {
          id: bookId,
        },
      });
      if (!book) throw new Error(NO_BOOK_MESSAGE);
      return book;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} query
   * @returns
   * @memberof BookController
   */
  static async filterBooks(query) {
    const {
      search
    } = query;
    const rating = search.split('r:')[1];
    try {
      if (rating) {
        const books = await BookController.filterBooksByRating(rating);
        return books.filter((item, index, self) => index === self.findIndex(element => (
          element.id === item.id
        )));
      }
      const books = await models.Book.findAll({
        where: {
          $and: [
            {
              name: {
                $iLike: `%${search}%`
              }
            },
            {
              genre: {
                $iLike: `%${search}%`
              }
            },
            {
              year: {
                $iLike: `%${search}%`
              }
            },
            {
              author: {
                $iLike: `%${search}%`
              }
            }
          ]
        }
      });
      if (!books) throw new Error(NO_BOOK_MESSAGE);
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
   * @param {*} rating
   * @returns
   * @memberof BookController
   */
  static async filterBooksByRating(rating) {
    try {
      const books = await models.Review.findAll({
        where: {
          rating: +rating
        },
        include: [{
          model: models.Book,
          as: BOOK_LABEL,
        }]
      }).map((value) => {
        value.get({ plain: true });
        return value.book;
      });
      if (!books) throw new Error(NO_BOOK_MESSAGE);
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
   * @memberof BookController
   */
  static async updateBook(data, authStatus) {
    try {
      authStatusCheck(authStatus);
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error(NO_BOOK_FOUND);
      if (authStatus.id !== book.userId) {
        throw new Error(PERMISSION_DENIED);
      }
      const updatedBook = await book.update({
        ...data
      });
      updatedBook.message = BOOK_UPDATED_MESSAGE;
      return updatedBook;
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
   * @memberof BookController
   */
  static async deleteBook(data, authStatus) {
    try {
      authStatusCheck(authStatus);
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error(NO_BOOK_FOUND);
      if (authStatus.id !== book.userId) {
        throw new Error(PERMISSION_DENIED);
      }
      await book.destroy();
      return {
        message: BOOK_DELETED_MESSAGE,
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookController;
