import shortid from 'shortid';
import randomColor from 'randomcolor';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { darkLuminosity, colorFormat } from './default';

class Utils {
  static generateId() {
    return shortid.generate();
  }

  static payloadSchema(data) {
    const {
      id, username, email, role, picture, isVerified, avatarColor
    } = data;
    return {
      id,
      username,
      email,
      role,
      picture,
      isVerified,
      avatarColor,
    };
  }

  static colorGenerator() {
    return randomColor({
      luminosity: darkLuminosity,
      format: colorFormat,
      alpha: 0.5
    });
  }

  static generateToken(payload, expires) {
    return jwt
      .sign(payload, process.env.SECRET, expires ? { expiresIn: process.env.EXPIRES_IN } : null);
  }

  static passwordHash(value) {
    return bcrypt.hashSync(value, 10);
  }

  static authenticate(authorization) {
    const token = authorization.split(' ')[1];
    try {
      return jwt.verify(token, process.env.SECRET, (err, decoded) => decoded);
    } catch (error) {
      return error;
    }
  }
}

export default Utils;
