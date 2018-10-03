import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

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
    password: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    }
  })
});

export default UserType;