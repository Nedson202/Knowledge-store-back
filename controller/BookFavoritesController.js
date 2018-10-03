import models from '../models';
import utils from '../utils';
import stackTracer from '../helper/stackTracer';
import BookController from './BookController';
import { retrieveBook } from '../helper/elasticSearch';
// import { addDocument } from '../helper/elasticSearch';

const { helper } = utils;

class BookFavoritesController {
  static async addToFavorites(data, authStatus) {
    const newData = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const retrievedBook = await retrieveBook(newData.bookId);
      await BookController.addBookIfNotExist(retrievedBook);
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      const favorite = await models.Favorite.findOne({
        where: {
          bookId: newData.bookId
        }
      });
      if (favorite) throw new Error('Book is in your list of favorites');
      await models.Favorite.create(newData);
      return {
        message: 'Book added to favorites'
      };
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async checkFavorite(bookId) {
    try {
      // if (!authStatus) {
      //   throw new Error('Permission denied, you need to signup/login');
      // }
      const favorite = await models.Favorite.findOne({
        where: {
          bookId
        }
      });
      if (favorite) return true;
      return false;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async getFavorites(authStatus) {
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const books = await models.Favorite.findAll({
        where: {
          userId: id
        },
        include: [{
          model: models.Book,
          as: 'favoriteBook',
        }]
      }).map((value) => {
        value.get({ plain: true });
        return value.favoriteBook;
      });
      if (!books.length) return [];
      return books;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async removeFavorites(data, authStatus) {
    const { books } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      await models.Favorite.destroy({
        where: {
          userId: id,
          bookId: books,
        },
      });
      // if (!books.length) throw new Error('No books available');
      return {
        message: 'Book(s) removed from your list of favorites'
      };
      // return books;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }
}

export default BookFavoritesController;
