import {
  GraphQLString,
  GraphQLList,
} from 'graphql';

import ReviewType from '../types/review';
import Review from '../../controller/Review';

const ReviewQuery = {
  reviews: {
    type: new GraphQLList(ReviewType),
    args: {
      bookId: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return Review.getBookReviews(args.bookId);
    }
  },
};

export default ReviewQuery;
