import {
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';

import BookType from '../types/books';
import GenreType from '../types/genre';
import Book from '../../controller/Book';
import Genre from '../../controller/Genre';
import Favorites from '../../controller/Favorites';
import GoogleBooks from '../../controller/GooglBooks';
import { esInstance as elasticSearch } from '../../elasticSearch';
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
      return elasticSearch.updateBook(args);
    }
  },
  getGenres: {
    type: new GraphQLList(GenreType),
    resolve() {
      return Genre.getGenres();
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
      return Book.getUsersBooks(authorized);
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
      return Favorites.getFavorites(authorized);
    }
  },
};

export default BookQuery;
