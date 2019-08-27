import { stackLogger } from 'info-logger';
import models from '../models';
import mailer from '../utils/mailer';
import {
  production, DEV_SERVER, VERIFY_EMAIL_SUBJECT,
  PASSWORD_RESET_SUBJECT, RESENT_OTP_SUBJECT,
} from '../settings/default';
import {
  passwordResetTemplate, emailVerificationTemplate, resendOTPTemplate
} from '../emailTemplates';

const redirectUrl = process.env.NODE_ENV.match(production)
  ? process.env.PROD_SERVER : DEV_SERVER;

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
      await mailer(emailTemplate, email, VERIFY_EMAIL_SUBJECT);
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
      await mailer(emailTemplate, email, PASSWORD_RESET_SUBJECT);
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
      await mailer(emailTemplate, email, RESENT_OTP_SUBJECT);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default EmailController;
