import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList
} from 'graphql';
import AuthorType from './author';
import ReviewType from './review';
import ReviewController from '../controller/ReviewController';

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
      type: GraphQLInt
    },
    message: {
      type: GraphQLString
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        // return _.filter(authors, {bookId: parent.id})
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent) {
        // return _.filter(reviews, {bookId: parent.id})
        // return reviews.filter(review => review.bookId === parent.id)[1]
        return ReviewController.getBookReviews(parent.id);
      }
    },
    averageRating: {
      type: GraphQLFloat,
      resolve(parent) {
        return ReviewController.getAverageRating(parent.id);
      }
    }
  })
});

export default BookType;
