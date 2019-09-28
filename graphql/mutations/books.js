import {
  GraphQLString,
  GraphQLList
} from 'graphql';
import BookType from '../types/books';
import BookController from '../../controller/BookController';
import Utils from '../../utils';

const BookMutation = {
  addBook: {
    type: BookType,
    args: {
      name: {
        type: GraphQLString
      },
      genre: {
        type: new GraphQLList(GraphQLString)
      },
      authors: {
        type: new GraphQLList(GraphQLString)
      },
      year: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      image: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return BookController.addBook(args, authorized);
    }
  },
  updateBook: {
    type: BookType,
    args: {
      bookId: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      genre: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      year: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return BookController.updateBook(args, authorized);
    }
  },
  deleteBook: {
    type: BookType,
    args: {
      bookId: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return BookController.deleteBook(args, authorized);
    }
  },
};

export default BookMutation;
