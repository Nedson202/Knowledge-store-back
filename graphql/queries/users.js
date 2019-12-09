import {
  GraphQLString,
  GraphQLList,
} from 'graphql';

import UserType from '../types/user';
import User from '../../controller/User';
import Utils from '../../utils';

const UserQuery = {
  fetchUsers: {
    type: new GraphQLList(UserType),
    args: {
      type: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.getAllUsers(args, authorized);
    }
  },
  sendVerificationEmail: {
    type: UserType,
    args: {
      email: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return User.sendVerificationEmail(args);
    }
  },
  forgotPassword: {
    type: UserType,
    args: {
      email: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return User.forgotPassword(args);
    }
  },
  decodeToken: {
    type: new GraphQLList(UserType),
    args: {
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { token } = args;
      const { authorization } = context.headers;
      const decodedToken = Utils.authenticate(authorization || token);
      return [decodedToken];
    }
  }
};

export default UserQuery;
