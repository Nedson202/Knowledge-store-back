import {
  GraphQLString,
  GraphQLList,
} from 'graphql';

import UserType from '../types/user';
import UserController from '../../controller/UserController';
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
      return UserController.getAllUsers(args, authorized);
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
      return UserController.sendVerificationEmail(args);
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
      return UserController.forgotPassword(args);
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
