import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';

import BookType from '../types/books';
import GenreType from '../types/genre';
import BookController from '../../controller/BookController';
import GenreController from '../../controller/GenreController';
import FavoritesController from '../../controller/FavoritesController';
import GoogleBooks from '../../controller/GooglBooks';
import { updateBook } from '../../elasticSearch';
import Utils from '../../utils';

const BookQuery = {
  book: {
    type: BookType,
    args: {
      id: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return GoogleBooks.retrieveBookProfile(args.id);
    }
  },
  books: {
    type: new GraphQLList(BookType),
    resolve() {
      return GoogleBooks.completeSearch('', {
        from: 10,
        size: 20
      });
    }
  },
  searchBooks: {
    type: new GraphQLList(BookType),
    args: {
      searchQuery: {
        type: GraphQLString
      },
      from: {
        type: GraphQLID
      },
      size: {
        type: GraphQLID
      }
    },
    resolve(parent, args) {
      const { from, size } = args;
      return GoogleBooks.completeSearch(args.searchQuery, {
        from,
        size
      });
    }
  },
  updateBooks: {
    type: new GraphQLList(BookType),
    args: {
      id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      year: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return updateBook(args);
    }
  },
  getGenres: {
    type: new GraphQLList(GenreType),
    resolve() {
      return GenreController.getGenres();
    }
  },
  usersBooks: {
    type: new GraphQLList(BookType),
    args: {
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { token } = args;
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(token || authorization);
      return BookController.getUsersBooks(authorized);
    }
  },
  favoriteBooks: {
    type: new GraphQLList(BookType),
    args: {
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { token } = args;
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(token || authorization);
      return FavoritesController.getFavorites(authorized);
    }
  },
};

export default BookQuery;
