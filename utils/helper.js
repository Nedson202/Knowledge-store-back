import shortid from 'shortid';
import randomColor from 'randomcolor';
import authenticator from 'otplib/authenticator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { stackLogger } from 'info-logger';
import { darkLuminosity, colorFormat } from './default';

authenticator.options = {
  crypto,
  step: 3600,
  digits: 4,
};

class Utils {
  /**
   *
   *
   * @static
   * @returns
   * @memberof Utils
   */
  static generateId() {
    return shortid.generate();
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Utils
   */
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

  /**
   *
   *
   * @static
   * @returns
   * @memberof Utils
   */
  static colorGenerator() {
    return randomColor({
      luminosity: darkLuminosity,
      format: colorFormat,
      alpha: 0.5
    });
  }

  /**
   *
   *
   * @static
   * @param {*} payload
   * @param {*} expires
   * @returns
   * @memberof Utils
   */
  static generateToken(payload, expires) {
    return jwt
      .sign(payload, process.env.SECRET, expires ? { expiresIn: process.env.EXPIRES_IN } : null);
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof Utils
   */
  static generateOTP() {
    const secret = authenticator.generateSecret();

    const OTP = authenticator.generate(secret);
    return {
      OTP,
      secret
    };
  }

  /**
   *
   *
   * @static
   * @param {*} OTP
   * @param {*} secret
   * @returns
   * @memberof Utils
   */
  static verifyOTP(OTP, secret) {
    try {
      let isValid = false;
      if (OTP && secret) {
        isValid = authenticator.check(OTP, secret);
      }
      return isValid;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} value
   * @returns
   * @memberof Utils
   */
  static passwordHash(value) {
    return bcrypt.hashSync(value, 10);
  }

  /**
   *
   *
   * @static
   * @param {*} oldHash
   * @param {*} newHash
   * @returns
   * @memberof Utils
   */
  static compareHash(oldHash, newHash) {
    return bcrypt.compareSync((oldHash), newHash);
  }

  /**
   *
   *
   * @static
   * @param {*} authorization
   * @returns
   * @memberof Utils
   */
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
