import {
  GraphQLString,
} from 'graphql';
import UserType from '../types/user';
import User from '../../controller/User';
import Utils from '../../utils';

const UserMutation = {
  addUser: {
    type: UserType,
    args: {
      username: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return User.addUser(args);
    }
  },
  loginUser: {
    type: UserType,
    args: {
      username: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      },
    },
    resolve(parent, args) {
      return User.authenticateUser(args);
    }
  },
  toggleAdmin: {
    type: UserType,
    args: {
      email: {
        type: GraphQLString
      },
      adminAction: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.toggleAdmin(args, authorized);
    }
  },
  addSuperAdmin: {
    type: UserType,
    args: {
      email: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.addSuperAdmin(args, authorized);
    }
  },
  deleteUser: {
    type: UserType,
    args: {
      userId: {
        type: GraphQLString
      }
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.deleteUser(args, authorized);
    }
  },
  editProfile: {
    type: UserType,
    args: {
      username: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      picture: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.editProfile(args, authorized);
    }
  },
  removeProfilePicture: {
    type: UserType,
    args: {
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { token } = args;
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization || token);
      return User.removeProfilePicture(authorized);
    }
  },
  changePassword: {
    type: UserType,
    args: {
      oldPassword: {
        type: GraphQLString
      },
      newPassword: {
        type: GraphQLString
      },
    },
    resolve(parent, args, context) {
      const { authorization } = context.headers;
      const authorized = Utils.authenticate(authorization);
      return User.changePassword(args, authorized);
    }
  },
  resetPassword: {
    type: UserType,
    args: {
      id: {
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
      OTP: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      return User.resetPassword(args);
    }
  },
  verifyEmail: {
    type: UserType,
    args: {
      token: {
        type: GraphQLString
      },
      OTP: {
        type: GraphQLString
      }
    },
    resolve(parent, args) {
      const { token } = args;
      const authorized = Utils.authenticate(token);
      return User.verifyEmail(args, authorized);
    }
  },
  verifyForgotPasswordRequest: {
    type: UserType,
    args: {
      OTP: {
        type: GraphQLString
      },
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args) {
      const { token } = args;
      const authorized = Utils.authenticate(token);
      return User.verifyForgotPasswordOTP(args, authorized);
    }
  },
  resendOTP: {
    type: UserType,
    args: {
      token: {
        type: GraphQLString
      },
    },
    resolve(parent, args) {
      const { token } = args;
      const authorized = Utils.authenticate(token);
      return User.resendOTP(authorized);
    }
  },
};

export default UserMutation;
