import {
  GraphQLString,
} from 'graphql';

import Utils from '../../utils';
import ReplyType from '../types/reply';
import ReplyController from '../../controller/ReplyController';

const ReplyMutation = {
  addReply: {
    type: ReplyType,
    args: {
      reviewId: {
        type: GraphQLString
      },
      reply: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return ReplyController.addReply(args, authorized);
    }
  },
  editReply: {
    type: ReplyType,
    args: {
      replyId: {
        type: GraphQLString
      },
      reply: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return ReplyController.editReply(args, authorized);
    }
  },
  toggleLikeOnReply: {
    type: ReplyType,
    args: {
      replyId: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return ReplyController.toggleLikeOnReply(args, authorized);
    }
  },
  deleteReply: {
    type: ReplyType,
    args: {
      replyId: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return ReplyController.deleteReply(args, authorized);
    }
  },
};

export default ReplyMutation;
