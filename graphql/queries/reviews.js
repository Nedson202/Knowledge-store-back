import {
  GraphQLString,
  GraphQLList,
} from 'graphql';

import ReviewType from '../types/review';
import ReviewController from '../../controller/ReviewController';

const ReviewQuery = {
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
};

export default ReviewQuery;
