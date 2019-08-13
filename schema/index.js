import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import BookType from './books';
import ReviewType from './review';
import Mutation from './mutations/index';
import BookController from '../controller/BookController';
import ReviewController from '../controller/ReviewController';
import utils from '../utils';
import GenreType from './genre';
import GenreController from '../controller/GenreController';
import UserType from './user';
import UserController from '../controller/UserController';
import BookFavoritesController from '../controller/BookFavoritesController';
import GoogleBooks from '../controller/GooglBooks';
import { updateBook } from '../elasticSearch/elasticSearch';

const { helper } = utils;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
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
        const authorized = helper.authenticate(token || authorization);
        return BookController.getUsersBooks(authorized);
      }
    },
    filterBooks: {
      type: new GraphQLList(BookType),
      args: {
        search: {
          type: GraphQLString
        },
      },
      resolve(parent, args) {
        return BookController.filterBooks(args);
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      args: {
        bookId: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        return ReviewController.getBookReviews(args.bookId);
      }
    },
    fetchUsers: {
      type: new GraphQLList(UserType),
      args: {
        type: {
          type: GraphQLString
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return UserController.getAllUsers(args, authorized);
      }
    },
    sendVerificationEmail: {
      type: UserType,
      args: {
        email: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        return UserController.sendVerificationEmail(args);
      }
    },
    forgotPassword: {
      type: UserType,
      args: {
        email: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        return UserController.forgotPassword(args);
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
        const authorized = helper.authenticate(token || authorization);
        return BookFavoritesController.getFavorites(authorized);
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
    decodeToken: {
      type: new GraphQLList(UserType),
      args: {
        token: {
          type: GraphQLString
        },
      },
      resolve(parent, args, context) {
        const { token } = args;
        const { authorization } = context.headers;
        const decodedToken = helper.authenticate(authorization || token);
        return [decodedToken];
      }
    }
  }
});

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default graphqlSchema;
