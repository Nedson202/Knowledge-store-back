import {
  GraphQLString,
  GraphQLList
} from 'graphql';

import BookType from '../types/books';
import Favorites from '../../controller/Favorites';
import Utils from '../../utils';

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
      const authorized = Utils.authenticate(authorization);
      return Favorites.addToFavorites(args, authorized);
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
      const authorized = Utils.authenticate(authorization);
      return Favorites.removeFavorites(args, authorized);
    }
  },
};

export default FavoriteMutation;
