const nodemailer = require('nodemailer');

const ourEmail = 'help.virusshop@gmail.com' ;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ourEmail,
    pass: process.env.GMAIL_PASSWORD
  }
});

var mailOptions = {
  from: ourEmail, //try other email
  to: '',
  subject: 'Reset Password - Virushelp.shop',
  text: ''
};




let resetPasswordEmail = function (email, name, token) {
    mailOptions.to = email;
    mailOptions.text = `
    Dear ${name},\n  Here is the link to reset your password: https://www.virushelp.shop/reset/${token} \n You have 1 hour before this link is deactivated.
    `;

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};

let verifyAccountEmail = function (email, name, token) {
    mailOptions.to = email;
    mailOptions.text = `
    Dear ${name},\n  Please click this link to verify your email: https://www.virushelp.shop/reset/${token} \n You have 1 hour before this link is deactivated.
    `;

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};

module.exports = { resetPasswordEmail, verifyAccountEmail }