import bcrypt from 'bcrypt';
import models from '../models';
import utils from '../utils';
import logger from '../helper/logger';
import stackTracer from '../helper/stackTracer';
import mailUser from '../utils/mailUser';

const { helper, validator, emailHandler } = utils;

class UserController {
  static async addUser(user) {
    const { username, email, password } = user;
    try {
      const errors = validator.validateSignup({
        username, email, password
      });
      if (Object.keys(errors).length !== 0) throw new Error(JSON.stringify(errors));
      const user = await models.User.create({
        id: helper.generateId(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
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
    } catch(error) {
      stackTracer(error);
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
          username: username.toLowerCase()
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
        username,
      };
      const token = helper.generateToken(payload);
      payload.token = token;
      return payload;
    } catch(error) {
      stackTracer(error);
      return error;
    }
  }

  static async forgotPassword(user) {
    const { email } = user;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0) throw new Error(JSON.stringify(errors))
      const user = await models.User.find({
        where: {
          email
        }
      });
      const payload = {
        id: user.id,
        email,
      };
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.username = user.username
      await emailHandler(payload);
      return {
        message: 'Password reset link has been sent to your email.',
        token
      };
    } catch(error) {
      stackTracer(error);
      return error;
    }
  }

  static async changePassword(data, authStatus) {
    const { oldPassword, newPassword } = data;
    try {
      if (!authStatus) throw new Error('Permission denied, you need to signup/login');
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if(!user.role) throw new Error('User not found');
      if (bcrypt.compareSync((oldPassword), user.password)) {
        await user.update({
          password: bcrypt.hashSync(newPassword, 10)
        });
        return {
          message: 'Password change was successful.',
        };
      }
      throw new Error('Sorry the old password provided is incorrect');
    } catch(error) {
      stackTracer(error);
      return error;
    }
  }

  static async findUser(email, userId) {
    try {
      const user = await models.User.findOne({
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
    } catch(error) {
      stackTracer(error);
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

  static async toggleAdmin(data, authStatus) {
    const { userId, adminAction } = data;
    try {
      if (!authStatus) throw new Error('Permission denied, you need to signup/login');
      const { id } = authStatus;
      const verifySuperAdmin = await UserController.verifyAdmin(id, 'super');
      const user = await UserController.findUser(null, userId);
      if (!user.role) throw new Error('User not found');
      if (verifySuperAdmin) {
        await user.update({
          role: adminAction === 'add' ? 'admin' : 'user'
        });
        return {
          message: adminAction === 'add'
            ? 'User was added successfully as admin'
            : 'User has been removed as admin'
        };
      }
      throw new Error('Operation denied, you are not a super admin');
    } catch(error) {
      stackTracer(error);
      return error;
    }
  }

  static async deleteUser(userId, authStatus) {
    try {
      if (!authStatus) throw new Error('Permission denied, you need to signup/login');
      const { id } = authStatus;
      const verifyAdmin = await UserController.verifyAdmin(id, 'admin');
      // return console.log(verifyAdmin)
      const user = await UserController.findUser(null, userId);
      if (!user.role) throw new Error('User not found');
      if (verifyAdmin) {
        await user.destroy();
        return {
          message: 'User has been deleted'
        };
      }
      throw new Error('Operation denied, you are not an admin');
    } catch(error) {
      stackTracer(error);
      return error;
    }
  }

  static async verifyAdmin(userId, type) {
    try {
      const user = await UserController.findUser(null, userId);
      if (!user.role) throw new Error('User not found');
      if (type === 'super' && user.role === 'super') return true;
      if (type === 'admin' && user.role === 'admin') return true;
      return false;
    } catch(error) {
      stackTracer(error);
    }
  }
}

export default UserController;
