const nodemailer = require('nodemailer');

// Configure the transport with valid credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mariyasaji321@gmail.com',
    pass: 'yyeu aeom jplm upcf'
  }
});

// Function to send an email
const sendLoginEmail = (toEmail, subject, text) => {
  const mailOptions = {
    from: 'mariyasaji321@gmail.com',
    to: toEmail,
    subject: subject, 
    text: text
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending Email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
};

module.exports = { sendLoginEmail };
