import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import { addDocument } from '../elasticSearch/elasticSearch';
import authStatusCheck from '../utils/authStatusCheck';

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
      authStatusCheck(authStatus);
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const createdBook = await models.Book.create(newData);
      addDocument(newData, 'book');
      return createdBook;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async addBookIfNotExist(book) {
    await models.Book.findOrCreate({
      where: {
        id: book.id
      },
      defaults: book
    });
  }

  static async getBooks() {
    try {
      const books = await models.Book.findAll({
        include: [{
          model: models.Review,
          as: 'bookReviews',
        }]
      });
      if (!books.length) throw new Error('No books available');
      return books;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

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

  static async getUsersBooks(authStatus) {
    try {
      const usersBooks = await models.Book.findAll({
        where: {
          userId: authStatus.id
        }
      });
      if (!usersBooks) throw new Error('you have no books yet');
      return usersBooks;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async getBook(bookId) {
    try {
      const book = await models.Book.findById(bookId);
      if (!book) throw new Error('No book found');
      return book;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

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
      if (!books) throw new Error('No books available');
      return books;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async filterBooksByRating(rating) {
    try {
      const books = await models.Review.findAll({
        where: {
          rating: +rating
        },
        include: [{
          model: models.Book,
          as: 'book',
        }]
      }).map((value) => {
        value.get({ plain: true });
        return value.book;
      });
      if (!books) throw new Error('No books available');
      return books;
    } catch (error) {
      stackLogger(error);
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
        throw new Error('Permission denied');
      }
      const updatedBook = await book.update({
        ...data
      });
      updatedBook.message = 'Book successfully updated';
      return updatedBook;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async deleteBook(data, authStatus) {
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const book = await BookController.getBook(data.bookId);
      if (!book.userId) throw new Error('No book found');
      if (authStatus.id !== book.userId) {
        throw new Error('Permission denied');
      }
      await book.destroy();
      return {
        message: 'Book successfully deleted'
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookController;
