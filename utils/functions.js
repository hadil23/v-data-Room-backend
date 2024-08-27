const axios = require('axios');
require('dotenv').config();

const sendSms = (phoneNumber, otp) => {
  const url = "https://8g6m5r.api.infobip.com/sms/2/text/advanced";
  const headers = {
    Authorization: "App " + process.env.INFOBIP_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const messageData = {
    messages: [
      {
        destinations: [{ to: phoneNumber }],
        from: "Midad",
        text: `Your verification code is: ${otp} wtX2mn8T14v`,
      },
    ],
  };

  axios
    .post(url, messageData, { headers })
    .then((response) => {
      console.log(response.data);
      response.data.messages.forEach((message) => {
        console.log(`Message ID: ${message.messageId}`);
        console.log(`Status: ${message.status.name}`);
        console.log(`Status Description: ${message.status.description}`);
        console.log(`To: ${message.to}`);
      });
    })
    .catch((error) => {
      console.error("Error sending SMS:", error.response ? error.response.data : error.message);
    });
};

const generateOPT = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  sendSms,
  generateOPT
};
