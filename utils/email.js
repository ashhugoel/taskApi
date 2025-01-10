const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:465,
  auth: {
    user: 'ritikgoel@hmritm.ac.in',
    pass: 'pbhk qzcs zzys rvzl',
  },
});

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: 'ritikgoel@hmritm.ac.in',
    to: email,
    subject: 'Password Reset Verification Code',
    text: `Your password reset verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}


module.exports = { sendVerificationEmail };
