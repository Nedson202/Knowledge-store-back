import models from '../models';
import utils from '../utils';
import stackTracer from '../helper/stackTracer';

const { helper, validator } = utils;

class BookController {
  static async addBook(data, authStatus) {
    const newData = data;
    newData.id = helper.generateId();
    newData.userId = authStatus.id;
    const errors = validator.validateAddBook({
      ...newData
    });
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      return await models.Book.create(newData);
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async getBooks() {
    try {
      const books = await models.Book.findAll();
      if (!books) throw new Error('No books available');
      return books;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async getUsersBooks(userId) {
    try {
      const usersBooks = await models.Book.findAll({
        where: {
          userId
        }
      });
      if (!usersBooks) throw new Error('you have no books yet');
      return usersBooks;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async getBook(bookId) {
    try {
      const book = await models.Book.findById(bookId);
      if (!book) throw new Error('No book found');
      return book;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async updateBook(data, authStatus) {
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error('No book found');
      if (authStatus.id !== book.userId) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const updatedBook = await book.update({
        ...data
      });
      updatedBook.message = 'Book successfully deleted';
      return updatedBook;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }
}

export default BookController;
