import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import _ from 'lodash';
import BookType from './books';
import AuthorType from './author';
import UserType from './user';
import ReviewType from './review';
import { Mutation } from './mutations/index';
import UserController from '../controller/UserController';
import BookController from '../controller/BookController';
import ReviewController from '../controller/ReviewController';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return BookController.getBook(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return BookController.getBooks();
      }
    },
    usersBooks: {
      type: new GraphQLList(BookType),
      args: {
        userId: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        return BookController.getUsersBooks(args.userId);
      }
    },
    user: {
      type: UserType,
      args: {
        username: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
      },
      resolve(parent, args) {
        return UserController.authenticateUser(args);
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        // return _.find(authors, {id: args.id})
      }
    },
    review: {
      type: ReviewType,
      args: {
        bookId: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        // return _.filter(reviews, {bookId: args.bookId})
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
        // return _.filter(reviews, {bookId: parent.id})
        // return reviews.filter(review => review.bookId === parent.id)[1]
        return ReviewController.getBookReviews(args.bookId);
      }
    },
  }
});

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default graphqlSchema