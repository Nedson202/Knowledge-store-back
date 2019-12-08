import {
  GraphQLString,
  GraphQLList
} from 'graphql';
import BookType from '../types/books';
import Book from '../../controller/Book';
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
      return Book.addBook(args, authorized);
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
      return Book.updateBook(args, authorized);
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
      return Book.deleteBook(args, authorized);
    }
  },
};

export default BookMutation;
