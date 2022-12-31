import nodemailer from "nodemailer";

 const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'witsie101@gmail.com',
      pass: 'zaftqbnuedacdirh',
    },
  });

  const mailOptions = {
    from: 'witsie101@gmail.com',
    to: options.to,
    subject: options.subject,       
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};


export default sendEmail;