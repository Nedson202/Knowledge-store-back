import {
  GraphQLString,
  GraphQLList
} from 'graphql';

import BookType from '../types/books';
import BookFavoritesController from '../../controller/BookFavoritesController';
import utils from '../../utils';

const { helper } = utils;

const FavoriteMutation = {
  addFavorite: {
    type: BookType,
    args: {
      bookId: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = helper.authenticate(authorization);
      return BookFavoritesController.addToFavorites(args, authorized);
    }
  },
  removeFavorites: {
    type: BookType,
    args: {
      books: {
        type: new GraphQLList(GraphQLString)
      },
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = helper.authenticate(authorization);
      return BookFavoritesController.removeFavorites(args, authorized);
    }
  },
};

export default FavoriteMutation;
