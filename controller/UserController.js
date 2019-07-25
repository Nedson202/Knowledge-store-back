import bcrypt from 'bcrypt';
import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import mailUser from '../utils/mailUser';

const { helper, validator, emailHandler } = utils;

class UserController {
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
      const newUser = await models.User.create({
        id: helper.generateId(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
        socialId,
        picture,
        avatarColor: helper.colorGenerator()
      });
      const payload = helper.payloadSchema(newUser);
      const token = helper.generateToken(payload);
      mailUser(payload, token);
      payload.token = token;
      return payload;
    } catch (error) {
      stackLogger(error);
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
      const existingUser = await models.User.findOne({
        where: {
          username: username.toLowerCase()
        }
      });

      if (!existingUser) throw new Error('Unauthorized, check your username or password');

      if (!bcrypt.compareSync((password), existingUser.password)) {
        throw new Error(
          'Unauthorized, check your username or password'
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

  static async forgotPassword(data) {
    const { email } = data;
    try {
      const errors = validator.validateEmail({ email });
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      const user = await UserController.findUser(email);
      const payload = helper.payloadSchema(user);
      const token = helper.generateToken(payload, true);
      payload.token = token;
      payload.username = user.username;
      await emailHandler(payload);
      return {
        message: 'Password reset link has been sent to your email.',
        token
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async editProfile(data, authStatus) {
    const { email, username, picture: image } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error('User not found');
      const updatedUser = await user.update({
        email, username, picture: image || user.picture
      });
      const payload = helper.payloadSchema(updatedUser);
      const token = helper.generateToken(payload);
      payload.token = token;
      payload.message = 'Profile successfully updated';
      return payload;
    } catch (error) {
      stackLogger(error);
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
      stackLogger(error);
      return error;
    }
  }

  static async resetPassword(data) {
    const {
      id, email, password, token
    } = data;
    try {
      const decodedValue = helper.authenticate(token);
      if (!decodedValue.email.match(email)) throw new Error('Operation denied');
      const user = await UserController.findUser(email, id);
      if (!user.role) throw new Error('User not found');
      const passwordReset = await user.update({
        password: helper.passwordHash(password)
      });
      if (passwordReset) {
        const payload = {
          token: token.split(' ')[1],
          message: 'Password reset was successful.',
        };
        return payload;
      }
      throw new Error('Password reset failed');
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async verifyEmail(data) {
    const { id } = data;
    try {
      const user = await UserController.findUser(null, id);
      if (!user.role) throw new Error('User not found');
      await user.update({ isVerified: 'true' });
      const payload = user.dataValues;
      delete (payload.password);
      const token = helper.generateToken(payload);
      return {
        token,
        message: 'Email verified successfully'
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  static async sendVerificationEmail(data) {
    const { email } = data;
    try {
      const user = await UserController.findUser(email, null);
      if (!user.role) throw new Error('User not found');
      const payload = user.dataValues;
      delete (payload.password);
      const token = helper.generateToken(payload);
      await mailUser(payload, token);
      return {
        message: 'Verification email sent successfully'
      };
    } catch (error) {
      stackLogger(error);
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
      stackLogger(error);
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
    const { email, adminAction } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const { id } = authStatus;
      const verifySuperAdmin = await UserController
        .verifyAdmin(id, 'toggleAdmin');
      const user = await UserController.findUser(email, null);
      if (!user.role) throw new Error('Email provided is not registered');
      if (user.role.match('admin') && adminAction === 'add') {
        throw new Error('User is already an admin');
      }
      if (verifySuperAdmin) {
        await user.update({
          role: adminAction === 'add' ? 'admin' : 'user'
        });
        return {
          message: adminAction === 'add'
            ? 'User added successfully as an admin'
            : 'User has been removed as admin'
        };
      }
      throw new Error('Operation denied, you are not a super admin');
    } catch (error) {
      stackLogger(error);
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
      stackLogger(error);
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
      stackLogger(error);
    }
  }

  static async addSuperAdmin(data, authStatus) {
    const { email } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      if (!process.env.SUPER_ADMIN.includes(email)) {
        throw new Error('Permission denied, user cannot be elevated to super admin');
      }
      const user = await UserController.findUser(email, null);
      if (user.role === 'super') {
        return {
          message: 'User is already a super admin'
        };
      }
      await user.update({
        role: 'super'
      });
      return {
        message: 'User role successfully changed to super admin'
      };
    } catch (error) {
      stackLogger(error);
    }
  }

  static async getAllUsers(data, authStatus) {
    const { type } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      if (!['admin', 'super'].includes(authStatus.role)) {
        throw new Error('Permission denied, you are not an admin');
      }
      const users = await models.User.findAll({
        where: type === 'all' ? {} : {
          role: type
        },
        order: [['id', 'ASC']]
      });
      return users;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default UserController;
