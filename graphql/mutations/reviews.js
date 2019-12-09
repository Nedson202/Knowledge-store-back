import {
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';

import ReviewType from '../types/review';
import Review from '../../controller/Review';
import Utils from '../../utils';

const ReviewMutation = {
  addReview: {
    type: ReviewType,
    args: {
      bookId: {
        type: GraphQLString
      },
      review: {
        type: GraphQLString
      },
      rating: {
        type: GraphQLFloat
      },
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { token } = args;
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(token || authorization);
      return Review.addReview(args, authorized);
    }
  },
  editReview: {
    type: ReviewType,
    args: {
      reviewId: {
        type: GraphQLString
      },
      review: {
        type: GraphQLString
      },
      rating: {
        type: GraphQLFloat
      },
      like: {
        type: GraphQLInt
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return Review.editReview(args, authorized);
    }
  },
  deleteReview: {
    type: ReviewType,
    args: {
      reviewId: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return Review.deleteReview(args, authorized);
    }
  },
  toggleLikeOnReview: {
    type: ReviewType,
    args: {
      reviewId: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return Review.toggleLikeOnReview(args, authorized);
    }
  },
};

export default ReviewMutation;
