const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

const {
  EMAIL_FROM,
  NODE_ENV,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
} = process.env;

class Email {
  constructor(user, url) {
    this.url = url;
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.from = `Native Kampala <${EMAIL_FROM}>`;
  }

  newTransport() {
    if (NODE_ENV === 'production') {
      //SEND GRID
      return nodemailer.createTransport({
        service: 'SENDGRID_PASSWORD',
        auth: {
          user: SENDGRID_USERNAME,
          pass: SENDGRID_PASSWORD,
        },
      });
    }
    //MAILTRAP
    return nodemailer.createTransport({
      host: MAILTRAP_HOST,
      port: MAILTRAP_PORT,
      auth: {
        user: MAILTRAP_USERNAME,
        pass: MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../templates/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.toString(html),
    };

    //create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 min)'
    );
  }
}

module.exports = Email;
