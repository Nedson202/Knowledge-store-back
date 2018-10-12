import bcrypt from 'bcrypt';
import models from '../models';
import utils from '../utils';
import logger from '../helper/logger';
import stackTracer from '../helper/stackTracer';
import mailUser from '../utils/mailUser';

const { helper, validator: { validateSignup }, emailHandler } = utils;

class UserController {
  static async addUser(user) {
    const { username, email, password, socialId } = user;
    try {
      const errors = validateSignup({
        username,
        email,
        password
      });
      if (Object.keys(errors).length !== 0)
        throw new Error(JSON.stringify(errors));
      const user = await models.User.create({
        id: helper.generateId(),
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        socialId
      });
      const payload = {
        id: user.id,
        username,
        email
      };
      const token = helper.generateToken(payload);
      mailUser(payload, token)
      payload.token = token;
      return payload;
    } catch (error) {
      return error;
    }
  }

  static async authenticateUser(user) {
    const { username, password } = user;
    try {
      const errors = validator.validateData({username, password});
      if (Object.keys(errors).length !== 0) throw new Error(JSON.stringify(errors));
      const user = await models.User.find({
        where: {
          username
        }
      });
      if (user.username && !user.isVerified) throw new Error('Sorry, this account is not verified yet');
      if (!(user && bcrypt.compareSync((password), user.password))) {
        throw new Error(
          'Unauthorised, check your username or password'
        );
      }
      const payload = {
        id: user.id,
        username
      };
      const token = helper.generateToken(payload);
      payload.token = token;
      return payload;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async forgotPassword(user) {
    const { email } = user;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0)
        throw new Error(JSON.stringify(errors));
      const user = await models.User.find({
        where: {
          email
        }
      });
      const payload = {
        id: user.id,
        email
      };
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.username = user.username;
      await emailHandler(payload);
      return {
        message: 'Password reset link has been sent to your email.',
        token
      };
    } catch (error) {
      return error;
    }
  }

  static async changePassword(data, authStatus) {
    const { oldPassword, newPassword } = data;
    try {
      if (!authStatus)
        throw new Error('Permission denied, you need to signup/login');
      const { id } = authStatus;
      const user = await UserController.findUser(false, id);
      if (user && bcrypt.compareSync(oldPassword, user.password)) {
        await user.update({
          password: bcrypt.hashSync(newPassword, 10)
        });
        return {
          message: 'Password change was successful.'
        };
      }
      throw new Error('Sorry passwords do not match');
    } catch (error) {
      return error;
    }
  }

  static async findUser(email, userId) {
    try {
      const user = await models.User.find({
        where: {
          $or: [
            {
              email
            },
            {
              id: userId
            }
          ]
        }
      });
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      return error;
    }
  }

  static async checkUserExists(socialId) {
    try {
      const user = await models.User.find({
        where: {
          socialId
        }
      });
      if (!user) {
        return {}
      }
      return user;
    } catch (error) {
      return error;
    }
  }
}

export default UserController;
