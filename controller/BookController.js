import { stackLogger } from 'info-logger';
import utils from '../utils';
import { addDocument } from '../elasticSearch';
import authStatusCheck from '../utils/authStatusCheck';
import {
  BOOK_LABEL, NO_BOOK_MESSAGE,
  BOOK_UPDATED_MESSAGE, NO_BOOK_CREATED, BOOK_DELETED_MESSAGE,
  PERMISSION_DENIED, NO_BOOK_FOUND
} from '../settings/default';
import BookRepository from '../repository/Book';

const { helper, validator } = utils;
const bookRepository = new BookRepository();

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
      if (Object.keys(errors).length) {
        throw new Error(JSON.stringify(errors));
      }
      const createdBook = await bookRepository.create(newData);
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
  static async addBookIfNotExist(book, id) {
    await bookRepository.findOrCreate({
      id
    }, book);
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

      const usersBooks = await bookRepository.findAll({
        userId: authStatus.id
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
      const book = await bookRepository.findOne({
        id: bookId,
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
      const updatedBook = await bookRepository.updateOne({
        id: book.id
      }, {
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
      const { bookId } = data;
      authStatusCheck(authStatus);
      const book = await BookController.getBook(bookId);
      if (!book.userId) throw new Error(NO_BOOK_FOUND);
      if (authStatus.id !== book.userId) {
        throw new Error(PERMISSION_DENIED);
      }
      await bookRepository.deleteOne({
        id: bookId,
      });
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
