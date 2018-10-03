
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList
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
import ReplyType from '../reply';
import ReplyController from '../../controller/ReplyController';
import BookFavoritesController from '../../controller/BookFavoritesController';

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
          type: new GraphQLList(GraphQLString)
        },
        authors: {
          type: new GraphQLList(GraphQLString)
        },
        year: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        image: {
          type: GraphQLString
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
          type: GraphQLFloat
        }
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
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
        const authorized = helper.authenticate(authorization);
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
        const authorized = helper.authenticate(authorization);
        return ReviewController.deleteReview(args, authorized);
      }
    },
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
        const authorized = helper.authenticate(authorization);
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
        const authorized = helper.authenticate(authorization);
        return ReplyController.editReply(args, authorized);
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
        const authorized = helper.authenticate(authorization);
        return ReplyController.deleteReply(args, authorized);
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
        return UserController.authenticateUser(args);
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
        const authorized = helper.authenticate(authorization);
        return UserController.toggleAdmin(args, authorized);
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
        const authorized = helper.authenticate(authorization);
        return UserController.addSuperAdmin(args, authorized);
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
        const authorized = helper.authenticate(authorization);
        return UserController.editProfile(args, authorized);
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
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return UserController.resetPassword(args, authorized);
        // .then(response => [response]);
      }
    },
    verifyEmail: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        return UserController.verifyEmail(args);
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
    },
    deleteBook: {
      type: BookType,
      args: {
        bookId: {
          type: GraphQLString
        },
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return BookController.deleteBook(args, authorized);
      }
    },
    addFavorite: {
      type: BookType,
      args: {
        bookId: {
          type: GraphQLString
        },
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return BookFavoritesController.addToFavorites(args, authorized);
      }
    },
    removeFavorites: {
      type: BookType,
      args: {
        books: {
          type: new GraphQLList(GraphQLString)
        },
      },
      resolve(parent, args, context) {
        const { authorization } = context.headers;
        const authorized = helper.authenticate(authorization);
        return BookFavoritesController.removeFavorites(args, authorized);
      }
    }
  }
});

export default Mutation;
