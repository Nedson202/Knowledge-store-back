import { stackLogger } from 'info-logger';
import models from '../models';
import mailer from '../utils/mailer';
import {
  emailVerificationTemplate, passwordResetTemplate, resendOTPTemplate
} from '../emailTemplates';
import {
  production, devServer, verifyEmailSubject,
  passwordResetSubject, resendOTPSubject,
} from '../utils/default';

const redirectUrl = process.env.NODE_ENV.match(production)
  ? process.env.PROD_SERVER : devServer;

class EmailController {
  /**
   *
   *
   * @static
   * @param {*} user
   * @param {*} { token, OTP }
   * @returns
   * @memberof EmailController
   */
  static async sendEmailVerificationMail(user, { token, OTP }) {
    try {
      const { username, email } = user;
      const emailTemplate = emailVerificationTemplate({
        redirectUrl, username, OTP, token,
      });
      await mailer(emailTemplate, email, verifyEmailSubject);
      const oneUser = await models.User.findOne({
        where: {
          username: username.toLowerCase()
        }
      });
      await oneUser.update({ isEmailSent: 'true' });
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
   * @param {*} { token, OTP }
   * @returns
   * @memberof EmailController
   */
  static async sendPasswordResetMail(user, { token, OTP }) {
    try {
      const { username, email } = user;
      const emailTemplate = passwordResetTemplate({
        redirectUrl, username, OTP, token,
      });
      await mailer(emailTemplate, email, passwordResetSubject);
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
   * @param {*} { token, OTP }
   * @returns
   * @memberof EmailController
   */
  static async newOTPRequestMail({ username, email }, OTP) {
    try {
      const emailTemplate = resendOTPTemplate({
        username, OTP,
      });
      await mailer(emailTemplate, email, resendOTPSubject);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default EmailController;
