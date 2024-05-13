const { sendNotification } = require("./services/email_service");

sendNotification({
  body: "test",
  email: "srikondadhanushh@gmail.com",
}).catch((err) => {
  console.log(err);
});
