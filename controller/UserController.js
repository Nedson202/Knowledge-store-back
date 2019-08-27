import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import {
  USER_UNAUTHORIZED,
  RESET_LINK_MESSAGE, PROFILE_UPDATED, NO_USER, USER_ORDER, SUPER_ADMIN_ROLE,
  OLD_PASSWORD_INCORRECT, RESET_SUCCESSFUL, RESET_FAILED, ADMIN_ROLE,
  PASSWORD_CHANGE_SUCCESSFUL, OPERATION_DENIED, USER_DELETED_MESSAGE,
  USER_ROLE, EMAIL_SENT_MESSAGE, USER_IS_ADMIN, NOT_AN_ADMIN, EMAIL_VERIFIED_MESSAGE,
  OTP_FAILED, OTP_SUCCESS, FORGOT_PASSWORD_OP_DENIED, OTP_RESEND_FAILED,
  OTP_RESEND_SUCCESS, EMAIL_VERIFICATION_FAILED, EMAIL_ALREADY_VERIFIED,
} from '../settings/default';
import EmailController from './EmailController';
import authStatusCheck from '../utils/authStatusCheck';

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
      if (!existingUser) throw new Error(USER_UNAUTHORIZED);
      const passwordMatch = helper.compareHash(password, existingUser.password);
      if (!passwordMatch) {
        throw new Error(
          USER_UNAUTHORIZED
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
      if (!user.id) throw new Error(NO_USER);
      const payload = helper.payloadSchema(user);
      const token = helper.generateToken(payload, true);
      payload.token = token;
      payload.username = user.username;
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      EmailController.sendPasswordResetMail(payload, { token, OTP });
      return {
        message: RESET_LINK_MESSAGE,
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
        throw new Error(FORGOT_PASSWORD_OP_DENIED);
      }
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      if (OTP) {
        isOTPValid = helper.verifyOTP(OTP, user.OTPSecret);
      }
      if (OTP && !isOTPValid) {
        return {
          message: OTP_FAILED
        };
      }
      await user.update({ OTPSecret: null });
      const payload = user.dataValues;
      delete (payload.password);
      return {
        message: OTP_SUCCESS,
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
      if (!id) throw new Error(OTP_RESEND_FAILED);
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      EmailController.newOTPRequestMail(authStatus, OTP);
      return {
        message: OTP_RESEND_SUCCESS,
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
      authStatusCheck(authStatus);
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      const updatedUser = await user.update({
        username: username || user.username,
        email: email || user.email,
        picture: image || user.picture
      });
      const payload = helper.payloadSchema(updatedUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.message = PROFILE_UPDATED;
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
      authStatusCheck(authStatus);
      const { id, } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      const updatedUser = await user.update({
        picture: '',
      });
      const payload = helper.payloadSchema(updatedUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.message = PROFILE_UPDATED;
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
      authStatusCheck(authStatus);
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      const passwordMatch = helper.compareHash(oldPassword, user.password);
      if (!passwordMatch) {
        throw new Error(OLD_PASSWORD_INCORRECT);
      }
      await user.update({
        password: helper.passwordHash(newPassword)
      });
      return {
        message: PASSWORD_CHANGE_SUCCESSFUL,
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
      if (!decodedValue.email.match(email)) throw new Error(OPERATION_DENIED);
      const user = await UserController.findUser(email, id);
      if (!user.role) throw new Error(NO_USER);
      const passwordReset = await user.update({
        password: helper.passwordHash(password),
      });
      if (!passwordReset) {
        throw new Error(RESET_FAILED);
      }
      const payload = {
        token: token.split(' ')[1],
        message: RESET_SUCCESSFUL,
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
        throw new Error(EMAIL_VERIFICATION_FAILED);
      }
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error(NO_USER);
      const isVerified = JSON.parse(user.isVerified);
      if (isVerified) throw new Error(EMAIL_ALREADY_VERIFIED);
      if (OTP) {
        isOTPValid = helper.verifyOTP(OTP, user.OTPSecret);
      }
      if (OTP && !isOTPValid) {
        return {
          message: OTP_FAILED
        };
      }
      await user.update({ isVerified: 'true', OTPSecret: null });
      const payload = user.dataValues;
      delete (payload.password);
      const token = helper.generateToken(payload);
      return {
        token,
        message: EMAIL_VERIFIED_MESSAGE
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
      if (!user.id) throw new Error(NO_USER);
      const payload = user.dataValues;
      delete (payload.password);
      const { OTP, secret } = utils.helper.generateOTP();
      await user.update({ OTPSecret: secret });
      const token = helper.generateToken(payload);
      await EmailController.sendEmailVerificationMail(payload, { token, OTP });
      return {
        message: EMAIL_SENT_MESSAGE
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
      if (!user) throw new Error(NO_USER);
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
      const user = await models.User.findOne({
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
      authStatusCheck(authStatus);
      const { id } = authStatus;
      const verifySuperAdmin = await UserController
        .verifyAdmin(id, 'toggleAdmin');
      const user = await UserController.findUser(email, null);
      if (!user.role) throw new Error('Email provided is not registered');
      if (user.role.match(ADMIN_ROLE) && adminAction === 'add') {
        throw new Error(USER_IS_ADMIN);
      }
      if (!verifySuperAdmin) {
        throw new Error('Operation denied, you are not a super admin');
      }
      await user.update({
        role: adminAction === 'add' ? ADMIN_ROLE : USER_ROLE
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
      authStatusCheck(authStatus);
      const { id } = authStatus;
      const verifyAdmin = await UserController.verifyAdmin(id, 'deleteUser');
      const user = await UserController.findUser(null, userId);
      if (!user.username) throw new Error(NO_USER);
      if (!verifyAdmin) {
        throw new Error(NOT_AN_ADMIN);
      }
      await user.destroy();
      return {
        message: USER_DELETED_MESSAGE
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
        throw new Error(NOT_AN_ADMIN);
      }
      switch (action) {
        case 'deleteUser':
          if (user.role === SUPER_ADMIN_ROLE || user.role === ADMIN_ROLE) return true;

        case 'toggleAdmin':
          if (user.role === SUPER_ADMIN_ROLE) return true;
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
      authStatusCheck(authStatus);
      if (!process.env.SUPER_ADMIN.includes(email)) {
        throw new Error('Permission denied, user cannot be elevated to super admin');
      }
      const user = await UserController.findUser(email, null);
      if (user.role === SUPER_ADMIN_ROLE) {
        return {
          message: 'User is already a super admin'
        };
      }
      await user.update({
        role: SUPER_ADMIN_ROLE
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
      authStatusCheck(authStatus);
      if (![ADMIN_ROLE, SUPER_ADMIN_ROLE].includes(authStatus.role)) {
        throw new Error(NOT_AN_ADMIN);
      }
      const users = await models.User.findAll({
        where: type === 'all' ? {} : {
          role: type
        },
        order: [USER_ORDER]
      });
      return users;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default UserController;
