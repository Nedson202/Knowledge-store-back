import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import {
  GraphQLDateTime,
} from 'graphql-iso-date';

import ReviewType from './review';
import ReviewController from '../controller/ReviewController';
import GoogleBooks from '../controller/GooglBooks';
import BookFavoritesController from '../controller/BookFavoritesController';

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLString
    },
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
    message: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    isFavorite: {
      type: GraphQLBoolean,
      resolve(parent) {
        return BookFavoritesController.checkFavorite(parent.id);
      }
    },
    userId: {
      type: GraphQLString
    },
    pageCount: {
      type: GraphQLInt
    },
    downloadable: {
      type: new GraphQLList(GraphQLString)
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent) {
        return ReviewController.getBookReviews(parent.id);
      }
    },
    averageRating: {
      type: GraphQLFloat,
      resolve(parent) {
        return ReviewController.getAverageRating(parent.id);
      }
    },
    googleAverageRating: {
      type: GraphQLFloat,
    },
    createdAt: {
      type: GraphQLDateTime
    },
    updatedAt: {
      type: GraphQLDateTime
    },
    moreBooks: {
      type: new GraphQLList(BookType),
      resolve(parent) {
        return GoogleBooks.retrieveMoreBooks(parent.id);
      }
    },
  })
});

export default BookType;
