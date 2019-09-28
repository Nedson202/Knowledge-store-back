import { stackLogger } from 'info-logger';
import mailer from '../utils/mailer';
import {
  PRODUCTION, DEV_SERVER, VERIFY_EMAIL_SUBJECT,
  PASSWORD_RESET_SUBJECT, RESENT_OTP_SUBJECT,
} from '../settings';
import {
  passwordResetTemplate, emailVerificationTemplate, resendOTPTemplate
} from '../emailTemplates';
import UserRepository from '../repository/User';

const redirectUrl = process.env.NODE_ENV.match(PRODUCTION)
  ? process.env.PROD_SERVER : DEV_SERVER;

const userRepository = new UserRepository();

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
      const { username, email, isVerified } = user;

      if (isVerified) {
        return;
      }

      const emailTemplate = emailVerificationTemplate({
        redirectUrl, username, OTP, token,
      });

      await mailer(emailTemplate, email, VERIFY_EMAIL_SUBJECT);

      await userRepository.updateOne({
        username: username.toLowerCase(),
      }, { isEmailSent: 'true' });
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
