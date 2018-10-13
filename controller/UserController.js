import bcrypt from 'bcrypt';
import models from '../models';
import utils from '../utils';
import stackTracer from '../helper/stackTracer';
import mailUser from '../utils/mailUser';

const { helper, validator, emailHandler } = utils;

class UserController {
  static async addUser(user) {
    const {
      username, email, password, socialId
    } = user;
    try {
      const errors = validator.validateSignup({
        username, email, password
      });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const newUser = await models.User.create({
        id: helper.generateId(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
        socialId
      });
      const payload = {
        id: newUser.id,
        username,
        email
      };
      const token = helper.generateToken(payload);
      mailUser(payload, token);
      payload.token = token;
      return payload;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async authenticateUser(user) {
    try {
      const { username, password } = user;
      const errors = validator.validateData({ username, password });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const newUser = await models.User.findOne({
        where: {
          username: username.toLowerCase()
        }
      });
      const { isVerified } = newUser;
      if (isVerified === 'false') {
        throw new Error('Sorry you need to verify your email');
      }
      if (!(newUser && bcrypt.compareSync((password), newUser.password))) {
        throw new Error(
          'Unauthorised, check your username or password'
        );
      }
      const payload = {
        id: newUser.id,
        username,
      };
      const token = helper.generateToken(payload);
      payload.token = token;
      return payload;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async forgotPassword(data) {
    const { email } = data;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
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
      payload.username = user.username;
      await emailHandler(payload);
      return {
        message: 'Password reset link has been sent to your email.',
        token
      };
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async changePassword(data, authStatus) {
    const { oldPassword, newPassword } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error('User not found');
      if (bcrypt.compareSync((oldPassword), user.password)) {
        await user.update({
          password: bcrypt.hashSync(newPassword, 10)
        });
        return {
          message: 'Password change was successful.',
        };
      }
      throw new Error('Sorry the old password provided is incorrect');
    } catch (error) {
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
    } catch (error) {
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
        return {};
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  static async toggleAdmin(data, authStatus) {
    const { userId, adminAction } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const verifySuperAdmin = await UserController
        .verifyAdmin(id, 'toggleAdmin');
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
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async deleteUser(data, authStatus) {
    const { userId } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const verifyAdmin = await UserController.verifyAdmin(id, 'deleteUser');
      const user = await UserController.findUser(null, userId);
      if (!user.username) throw new Error('User not found');
      if (verifyAdmin) {
        await user.destroy();
        return {
          message: 'User has been deleted'
        };
      }
      throw new Error('Permission denied, you are not an admin');
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async verifyAdmin(userId, action) {
    try {
      const user = await UserController.findUser(null, userId);
      if (!user.role) {
        throw new Error('Permission denied, you do not have admin rights');
      }
      switch (action) {
        case 'deleteUser':
          if (user.role === 'super' || user.role === 'admin') return true;

        case 'toggleAdmin':
          if (user.role === 'super') return true;
        default:
          return false;
      }
    } catch (error) {
      stackTracer(error);
    }
  }
}

export default UserController;
