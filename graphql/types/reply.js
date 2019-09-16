import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  GraphQLDateTime,
} from 'graphql-iso-date';


const ReplyType = new GraphQLObjectType({
  name: 'Reply',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    reply: { type: GraphQLString },
    replier: {
      type: GraphQLString
    },
    picture: {
      type: GraphQLString
    },
    avatarColor: {
      type: GraphQLString
    },
    likes: {
      type: GraphQLInt
    },
    userId: {
      type: GraphQLString
    },
    repliesLikedBy: {
      type: GraphQLString
    },
    reviewId: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLDateTime
    },
    updatedAt: {
      type: GraphQLDateTime
    },
  })
});

export default ReplyType;
