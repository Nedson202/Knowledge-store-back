import sgMail from '@sendgrid/mail';

const mailer = async (template, recipient, subject) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: recipient,
    from: process.env.SENDER,
    subject,
    html: template,
  };

  await sgMail.send(msg);
};

export default mailer;
