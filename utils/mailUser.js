import nodemailer from 'nodemailer';
import models from '../models';
import { logger } from '../helper/logger';

const mailUser = async (user, token) => {
  const { username, email } = user;
  const transporter = await nodemailer.createTransport({
    service: process.env.NODE_MAILER_SERVICE,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS
    }
  });
  const redirectUrl = process.env.NODE_ENV.match('production')
    ? process.env.PROD_SERVER : 'http://localhost:3000';
  const mailOptions = {
    from: 'knowledgestore@gmail.com',
    to: email,
    subject: 'Knowledge Store - Verify Email',
    html: `<div
    style="width:600px;
    display:block;
    margin: 0 auto;
    border-radius:5px;
    color:black;
    display: grid;
    grid-template-column: 1fr;
    grid-gap: 2px;
    text-align: center; font-family: Georgia;">
      <div
      style="font-size: 35px;
      height: 60px;
      background-color: #eae9e9;">Lorester's Bookstore</div>
      <div style="height: 250px; background-color: #F5F5F5;">
        <div style="width: 400px; margin: auto; text-align: left;">
          <p style="font-size: 22px;">Welcome ${username}</p>
          <p>You are almost there great one.</p>
          <p
            style="margin-bottom: 45px;"
          >Click on the button below to confirm your email address</p>
          <a
          href="${redirectUrl}?verify-email=${token}" style="border: 1px solid black; padding: 10px; border-radius: 20px;
            color: #444444;
            cursor: pointer;
            width: 50%;
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            text-decoration: none"
            onMouseOver="this.style.backgroundColor='#eae9e9',
            this.style.boxShadow='1px 2px 2px rgba(0, 0, 0, 0.2)'"
            onMouseOut="this.style.backgroundColor='#F5F5F5',
            this.style.boxShadow='none'">Confirm Email Address
          </a>
        </div>
      </div>
      <div style="height: 70px; background-color: #eae9e9;">
        <span
          style="line-height: 2rem;"
        >Your online Knowledge store: <em>Love</em></span>
        <p>Contact Us: 124-563</p>
      </div>
    </div>`
  };
  try {
    await transporter.sendMail(mailOptions, async (error) => {
      if (!error) {
        const oneUser = await models.User.findOne({
          where: {
            username: username.toLowerCase()
          }
        });
        await oneUser.update({ isEmailSent: 'true' });
      }
      logger.error(error);
    });
  } catch (error) {
    return error;
  }
};

export default mailUser;
