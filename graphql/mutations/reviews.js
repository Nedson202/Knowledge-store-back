import {
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';

import ReviewType from '../types/review';
import ReviewController from '../../controller/ReviewController';
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
      return ReviewController.addReview(args, authorized);
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
      return ReviewController.editReview(args, authorized);
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
      return ReviewController.deleteReview(args, authorized);
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
      return ReviewController.toggleLikeOnReview(args, authorized);
    }
  },
};

export default ReviewMutation;
