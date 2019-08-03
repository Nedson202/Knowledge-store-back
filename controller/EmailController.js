import { stackLogger } from 'info-logger';
import models from '../models';
import mailer from '../utils/mailer';
import emailVerificationTemplate from '../EmailTemplates/emailVerification';
import {
  production, devServer, verifyEmailSubject,
  passwordResetSubject
} from '../utils/default';
import passwordResetTemplate from '../EmailTemplates/passwordReset';

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
}

export default EmailController;
