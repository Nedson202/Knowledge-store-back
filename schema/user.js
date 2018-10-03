import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  GraphQLDateTime,
} from 'graphql-iso-date';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    role: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    },
    socialId: {
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

export default UserType;
