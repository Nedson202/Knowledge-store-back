import nodemailer from 'nodemailer';

const emailHandler = async (payload) => {
  const { username, email, token } = payload;
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.NODE_MAILER_SERVICE,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS
      }
    });
    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: email,
      subject: 'Lorester\'s Bookstore - Password reset help is here',
      html: `<div style="width:600px;  display:block; margin-left: auto; margin-right: auto;
      border-radius:5px;
      color:black;
      display: grid;
      grid-template-column: 1fr;
      grid-gap: 2px;
      text-align: center">
      <div style="font-size: 35px;
      height: 60px;
      font-family: Georgia;
      background-color: #eae9e9;">Lorester's Bookstore</div>
      <div style="height: 300px;
      font-family: Georgia;
      background-color: #F5F5F5;">
        <div style="width: 400px;
      margin: auto;
      text-align: left;">
          <h3 class="addressee">Hi ${username}</h3>
          <p>We learnt you lost your password.</p>
          <p>Do not worry because we have travelled far and wide to offer you the help needed.</p>
          <p>Use the button below to reset your password</p>
          <a href="http://localhost:3000/password-reset?${token}" style="border: 1px solid #000;
      padding: 15px;
      border-radius: 30px;
      color: #444444;
      cursor: pointer;
      width: 40%;
      display: block;
      margin-left: auto;
      margin-right: auto;
      text-align: center; text-decoration: none" onMouseOver="this.style.backgroundColor='#eae9e9', this.style.boxShadow='1px 2px 2px rgba(0, 0, 0, 0.2)'" onMouseOut="this.style.backgroundColor='#F5F5F5', this.style.boxShadow='none'">RESET PASSWORD</a>
        </div>
        <div style="padding-top: 20px !important;">
          <em>If you didn't request for this, please ignore. Link will expire in 2 hours</em>
        </div>
      </div>
      <div style="height: 60px;
      font-family: Georgia;
      background-color: #eae9e9;">
        <span>Your online Knowledge store: <em>Love</em></span>
        <p>Contact Us: 124-563</p>
      </div>
    </div>`
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw new Error('Email Not Sent!');
      return info.messageId;
    });
  } catch(error) {
    return error;
  }
};

export default emailHandler;