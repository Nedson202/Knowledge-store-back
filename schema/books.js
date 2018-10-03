import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLList
} from 'graphql';
import _ from 'lodash';
import AuthorType from './author';
import ReviewType from './review';
import ReviewController from '../controller/ReviewController';
import utils from '../utils';

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
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    },
    year: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return _.filter(authors, {bookId: parent.id})
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        // return _.filter(reviews, {bookId: parent.id})
        // return reviews.filter(review => review.bookId === parent.id)[1]
        return ReviewController.getBookReviews(parent.id);
      }
    },
    averageRating: {
      type: GraphQLFloat,
      resolve(parent, args) {
        return ReviewController.getAverageRating(parent.id);
      }
    }
  })
});

export default BookType;