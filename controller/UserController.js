import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import {
  authStatusPermission, userUnauthorizedMessage,
  resetLinkMessage, profileUpdated, noUser, userOrder, superRole,
  oldPasswordIncorrect, resetSuccessful, resetFailed, adminRole,
  passwordChangeSuccessful, operationDenied, userDeletedMessage,
  userRole, emailSentMessage, userIsAdmin, notAnAdmin, emailVerifiedMessage,
  OTPFailed, OTPSuccess, forgotPasswordOPDenied, resendOTPFailed,
  resendOTPSuccess, emailVerificationFailed, emailAlreadyVerified,
} from '../utils/default';
import EmailController from './EmailController';

const { helper, validator } = utils;

class UserController {
  /**
   *
   *
   * @static
   * @param {*} user
   * @returns
   * @memberof UserController
   */
  static async addUser(user) {
    const {
      username, email, password, socialId, picture
    } = user;
    try {
      const errors = validator.validateSignup({
        username, email, password
      });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const { OTP, secret } = utils.helper.generateOTP();
      const newUser = await models.User.create({
        id: helper.generateId(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: helper.passwordHash(password),
        socialId,
        picture,
        avatarColor: helper.colorGenerator(),
        OTPSecret: secret,
      });
      const payload = helper.payloadSchema(newUser);
      const token = helper.generateToken(payload);
      EmailController.sendEmailVerificationMail(payload, { token, OTP });
      payload.token = token;
      return payload;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} user
   * @returns
   * @memberof UserController
   */
  static async authenticateUser(user) {
    try {
      const { username, password } = user;
      const errors = validator.validateData({ username, password });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const existingUser = await models.User.findOne({
        where: {
          username: username.toLowerCase()
        }
      });
      if (!existingUser) throw new Error(userUnauthorizedMessage);
      const passwordMatch = helper.compareHash(password, existingUser.password);
      if (!passwordMatch) {
        throw new Error(
          userUnauthorizedMessage
        );
      }
      const payload = helper.payloadSchema(existingUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      return payload;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof UserController
   */
  static async forgotPassword(data) {
    const { email } = data;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const user = await UserController.findUser(email);
      if (!user.id) throw new Error(noUser);
      const payload = helper.payloadSchema(user);
      const token = helper.generateToken(payload, true);
      payload.token = token;
      payload.username = user.username;
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      EmailController.sendPasswordResetMail(payload, { token, OTP });
      return {
        message: resetLinkMessage,
        token
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async verifyForgotPasswordOTP(data, authStatus) {
    const { OTP } = data;
    const { id } = authStatus;
    let isOTPValid = false;
    try {
      if (!authStatus) {
        throw new Error(forgotPasswordOPDenied);
      }
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      if (OTP) {
        isOTPValid = helper.verifyOTP(OTP, user.OTPSecret);
      }
      if (OTP && !isOTPValid) {
        return {
          message: OTPFailed
        };
      }
      await user.update({ OTPSecret: null });
      const payload = user.dataValues;
      delete (payload.password);
      return {
        message: OTPSuccess,
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async resendOTP(authStatus) {
    const { id, } = authStatus;
    try {
      if (!id) throw new Error(resendOTPFailed);
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      EmailController.newOTPRequestMail(authStatus, OTP);
      return {
        message: resendOTPSuccess,
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async editProfile(data, authStatus) {
    const { email, username, picture: image } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      const updatedUser = await user.update({
        username: username || user.username,
        email: email || user.email,
        picture: image || user.picture
      });
      const payload = helper.payloadSchema(updatedUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.message = profileUpdated;
      return payload;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async removeProfilePicture(authStatus) {
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id, } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      const updatedUser = await user.update({
        picture: '',
      });
      const payload = helper.payloadSchema(updatedUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.message = profileUpdated;
      return payload;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async changePassword(data, authStatus) {
    const { oldPassword, newPassword } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      const passwordMatch = helper.compareHash(oldPassword, user.password);
      if (!passwordMatch) {
        throw new Error(oldPasswordIncorrect);
      }
      await user.update({
        password: helper.passwordHash(newPassword)
      });
      return {
        message: passwordChangeSuccessful,
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof UserController
   */
  static async resetPassword(data) {
    const {
      id, email, password, token
    } = data;
    try {
      const decodedValue = helper.authenticate(token);
      if (!decodedValue.email.match(email)) throw new Error(operationDenied);
      const user = await UserController.findUser(email, id);
      if (!user.role) throw new Error(noUser);
      const passwordReset = await user.update({
        password: helper.passwordHash(password),
      });
      if (!passwordReset) {
        throw new Error(resetFailed);
      }
      const payload = {
        token: token.split(' ')[1],
        message: resetSuccessful,
      };
      return payload;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof UserController
   */
  static async verifyEmail(data, authStatus) {
    const { OTP } = data;
    const { id } = authStatus;
    let isOTPValid = false;
    try {
      if (!authStatus) {
        throw new Error(emailVerificationFailed);
      }
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(noUser);
      const isVerified = JSON.parse(user.isVerified);
      if (isVerified) throw new Error(emailAlreadyVerified);
      if (OTP) {
        isOTPValid = helper.verifyOTP(OTP, user.OTPSecret);
      }
      if (OTP && !isOTPValid) {
        return {
          message: OTPFailed
        };
      }
      await user.update({ isVerified: 'true', OTPSecret: null });
      const payload = user.dataValues;
      delete (payload.password);
      const token = helper.generateToken(payload);
      return {
        token,
        message: emailVerifiedMessage
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof UserController
   */
  static async sendVerificationEmail(data) {
    const { email } = data;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const user = await UserController.findUser(email, null);
      if (!user.id) throw new Error(noUser);
      const payload = user.dataValues;
      delete (payload.password);
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      const token = helper.generateToken(payload);
      await EmailController.sendEmailVerificationMail(payload, { token, OTP });
      return {
        message: emailSentMessage
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} email
   * @param {*} userId
   * @returns
   * @memberof UserController
   */
  static async findUser(email, userId) {
    const queryObject = {};
    if (userId) {
      queryObject.id = userId;
    } else {
      queryObject.email = email;
    }
    try {
      const user = await models.User.findOne({
        where: queryObject
      });
      if (!user) throw new Error(noUser);
      return user;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} socialId
   * @returns
   * @memberof UserController
   */
  static async checkUserExists(socialId) {
    try {
      const user = await models.User.find({
        where: {
          socialId
        }
      });
      if (!user) {
        return {};
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async toggleAdmin(data, authStatus) {
    const { email, adminAction } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      const verifySuperAdmin = await UserController
        .verifyAdmin(id, 'toggleAdmin');
      const user = await UserController.findUser(email, null);
      if (!user.role) throw new Error('Email provided is not registered');
      if (user.role.match(adminRole) && adminAction === 'add') {
        throw new Error(userIsAdmin);
      }
      if (!verifySuperAdmin) {
        throw new Error('Operation denied, you are not a super admin');
      }
      await user.update({
        role: adminAction === 'add' ? adminRole : userRole
      });
      return {
        message: adminAction === 'add'
          ? 'User added successfully as an admin'
          : 'User has been removed as admin'
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async deleteUser(data, authStatus) {
    const { userId } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const { id } = authStatus;
      const verifyAdmin = await UserController.verifyAdmin(id, 'deleteUser');
      const user = await UserController.findUser(null, userId);
      if (!user.username) throw new Error(noUser);
      if (!verifyAdmin) {
        throw new Error(notAnAdmin);
      }
      await user.destroy();
      return {
        message: userDeletedMessage
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} userId
   * @param {*} action
   * @returns
   * @memberof UserController
   */
  static async verifyAdmin(userId, action) {
    try {
      const user = await UserController.findUser(null, userId);
      if (!user.role) {
        throw new Error(notAnAdmin);
      }
      switch (action) {
        case 'deleteUser':
          if (user.role === superRole || user.role === adminRole) return true;

        case 'toggleAdmin':
          if (user.role === superRole) return true;
        default:
          return false;
      }
    } catch (error) {
      stackLogger(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async addSuperAdmin(data, authStatus) {
    const { email } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      if (!process.env.SUPER_ADMIN.includes(email)) {
        throw new Error('Permission denied, user cannot be elevated to super admin');
      }
      const user = await UserController.findUser(email, null);
      if (user.role === superRole) {
        return {
          message: 'User is already a super admin'
        };
      }
      await user.update({
        role: superRole
      });
      return {
        message: 'User role successfully changed to super admin'
      };
    } catch (error) {
      stackLogger(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof UserController
   */
  static async getAllUsers(data, authStatus) {
    const { type } = data;
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      if (![adminRole, superRole].includes(authStatus.role)) {
        throw new Error(notAnAdmin);
      }
      const users = await models.User.findAll({
        where: type === 'all' ? {} : {
          role: type
        },
        order: [userOrder]
      });
      return users;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default UserController;
