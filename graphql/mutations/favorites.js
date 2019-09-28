import {
  GraphQLString,
  GraphQLList
} from 'graphql';

import BookType from '../types/books';
import FavoritesController from '../../controller/FavoritesController';
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
      return FavoritesController.addToFavorites(args, authorized);
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
      return FavoritesController.removeFavorites(args, authorized);
    }
  },
};

export default FavoriteMutation;
