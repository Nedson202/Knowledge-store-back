import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import {
  GraphQLDateTime,
} from 'graphql-iso-date';

import ReplyType from './reply';
import ReplyController from '../controller/ReplyController';

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    reviewer: {
      type: GraphQLString
    },
    picture: {
      type: GraphQLString
    },
    avatarColor: {
      type: GraphQLString
    },
    review: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLFloat
    },
    userId: {
      type: GraphQLString
    },
    bookId: {
      type: GraphQLString
    },
    replies: {
      type: new GraphQLList(ReplyType),
      resolve(parent) {
        return ReplyController.returnReplies(parent.id);
      }
    },
    likes: {
      type: GraphQLInt
    },
    createdAt: {
      type: GraphQLDateTime
    },
    updatedAt: {
      type: GraphQLDateTime
    },
  })
});

export default ReviewType;
