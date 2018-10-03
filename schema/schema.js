import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import BookType from './books';
// import AuthorType from './author';
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
import { updateBook } from '../helper/elasticSearch';

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
        // return retrieveBook(args.id);
        // return BookController.getBook(args.id);
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
    // books: {
    //   type: new GraphQLList(BookType),
    //   resolve() {
    //     return BookController.getBooks();
    //   }
    // },
    getGenres: {
      type: new GraphQLList(GenreType),
      resolve() {
        return GenreController.getGenres();
      }
    },
    usersBooks: {
      type: new GraphQLList(BookType),
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
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
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
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
        // return elasticItemSearch(args.searchQuery);
        // return GoogleBooks.searchBooks(args.searchQuery);
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
        // return GoogleBooks.completeSearch(args.searchQuery);
        // return elasticItemSearch(args.searchQuery);
        // return GoogleBooks.searchBooks(args);
      }
    },
  }
});

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default graphqlSchema;
