var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhanushram970@gmail.com",
    pass: "yiplgubzqgzdxgcn",
  },
});

module.exports.sendNotification = async function ({ body, email }) {
  console.log("sending mail to", email);
  var mailOptions = {
    from: process.env.serverMail,
    to: email,
    subject: "New Trash Notification",
    text: body,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
