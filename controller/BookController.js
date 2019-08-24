import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import { addDocument } from '../elasticSearch';
import authStatusCheck from '../utils/authStatusCheck';
import {
  bookLabel, bookReviewsLabel, noBookMessage,
  bookUpdatedMessage, noBookCreated, bookDeletedMessage,
  permissionDenied, authStatusPermission, noBookFound
} from '../utils/default';

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
      addDocument(newData, bookLabel);
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
          as: bookReviewsLabel,
        }]
      });
      if (!books.length) throw new Error(noBookMessage);
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
      const usersBooks = await models.Book.findAll({
        where: {
          userId: authStatus.id
        }
      });
      if (!usersBooks) throw new Error(noBookCreated);
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
      if (!book) throw new Error(noBookMessage);
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
      if (!books) throw new Error(noBookMessage);
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
          as: bookLabel,
        }]
      }).map((value) => {
        value.get({ plain: true });
        return value.book;
      });
      if (!books) throw new Error(noBookMessage);
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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error(noBookFound);
      if (authStatus.id !== book.userId) {
        throw new Error(permissionDenied);
      }
      const updatedBook = await book.update({
        ...data
      });
      updatedBook.message = bookUpdatedMessage;
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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error(noBookFound);
      if (authStatus.id !== book.userId) {
        throw new Error(permissionDenied);
      }
      await book.destroy();
      return {
        message: bookDeletedMessage,
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookController;
