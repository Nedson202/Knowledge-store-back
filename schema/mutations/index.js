
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} from 'graphql';
import BookType from '../books';
import AuthorType from '../author';
import UserType from '../user';
import ReviewType from '../review';
import AuthorController from '../../controller/AuthorController';
import UserController from '../../controller/UserController';
import BookController from '../../controller/BookController';
import utils from '../../utils';
import ReviewController from '../../controller/ReviewController';

const { helper } = utils;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        name: {
          type: GraphQLString
        },
        genre: {
          type: GraphQLString
        },
        author: {
          type: GraphQLString
        },
        year: {
          type: GraphQLInt
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return BookController.addBook(args, authorized);
      }
    },
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
          type: GraphQLID
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return ReviewController.addReview(args, authorized);
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        return AuthorController.addAuthor(args);
      }
    },
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
        return UserController.addUser(args);
      }
    },
    toggleAdmin: {
      type: UserType,
      args: {
        userId: {
          type: GraphQLString
        },
        adminAction: {
          type: GraphQLString
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return UserController.toggleAdmin(args, authorized);
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
        const authorized = helper.authenticate(authorization);
        return UserController.deleteUser(args, authorized);
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
        const authorized = helper.authenticate(authorization);
        return UserController.changePassword(args, authorized);
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
    updateBook: {
      type: BookType,
      args: {
        bookId: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        genre: {
          type: GraphQLString
        },
        author: {
          type: GraphQLString
        },
        year: {
          type: GraphQLString
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return BookController.updateBook(args, authorized);
      }
    }
  }
});

export default Mutation;
