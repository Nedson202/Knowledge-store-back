import { loggerInstance as logger } from '../logger';

import Utils from '../utils';
import validator from '../utils/validator';
import { esInstance as elasticSearch } from '../elasticSearch';
import authStatusCheck from '../utils/authStatusCheck';
import {
  BOOK_LABEL, NO_BOOK_MESSAGE,
  BOOK_UPDATED_MESSAGE, BOOK_DELETED_MESSAGE,
  PERMISSION_DENIED, NO_BOOK_FOUND
} from '../settings';
import BookRepository from '../repository/Book';

const bookRepository = new BookRepository();

class Book {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof Book
   */
  static async addBook(data, authStatus) {
    authStatusCheck(authStatus);

    const newData = data;
    newData.id = Utils.generateId();
    newData.userId = authStatus.id;
    const { isValid, errors } = validator.validateAddBook({
      ...newData
    });

    try {
      if (!isValid) {
        throw new Error(JSON.stringify(errors));
      }
      const createdBook = await bookRepository.create(newData);
      elasticSearch.addDocument(newData, BOOK_LABEL);

      return createdBook;
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} book
   * @memberof Book
   */
  static async addBookIfNotExist(book, id) {
    const response = await bookRepository.findOrCreate({
      id
    }, book);

    return response;
  }

  /**
   *
   *
   * @static
   * @param {*} authStatus
   * @returns
   * @memberof Book
   */
  static async getUsersBooks(authStatus) {
    try {
      authStatusCheck(authStatus);

      const usersBooks = await bookRepository.findAll({
        userId: authStatus.id
      });

      return usersBooks || [];
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof Book
   */
  static async getBook(bookId) {
    try {
      const book = await bookRepository.findOne({
        id: bookId,
      });
      if (!book) throw new Error(NO_BOOK_MESSAGE);

      return book;
    } catch (error) {
      logger.stackLogger(error);
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
   * @memberof Book
   */
  static async updateBook(data, authStatus) {
    try {
      authStatusCheck(authStatus);

      const book = await Book.getBook(data.bookId);

      if (!book.userId) throw new Error(NO_BOOK_FOUND);
      if (authStatus.id !== book.userId) {
        throw new Error(PERMISSION_DENIED);
      }

      const dataToUpdate = {
        ...data
      };

      const updatedBook = await bookRepository.updateOne({
        id: book.id
      }, dataToUpdate);
      updatedBook.message = BOOK_UPDATED_MESSAGE;

      return updatedBook;
    } catch (error) {
      logger.stackLogger(error);
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
   * @memberof Book
   */
  static async deleteBook(data, authStatus) {
    try {
      authStatusCheck(authStatus);

      const { bookId } = data;
      const book = await Book.getBook(bookId);

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
      logger.stackLogger(error);
      return error;
    }
  }
}

export default Book;
