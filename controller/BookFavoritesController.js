import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch/elasticSearch';

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
      stackLogger(error);
      return error;
    }
  }

  static async checkFavorite(bookId) {
    try {
      const favorite = await models.Favorite.findOne({
        where: {
          bookId
        }
      });
      if (favorite) return true;
      return false;
    } catch (error) {
      stackLogger(error);
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
      stackLogger(error);
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
      return {
        message: 'Book(s) removed from your list of favorites'
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookFavoritesController;
