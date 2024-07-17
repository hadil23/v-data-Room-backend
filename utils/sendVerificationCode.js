const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sendVerificationCode = async (email, code, virtualDataRoomId, ) => {
  console.log('Inside sendVerificationCode function');
  console.log('Email:', email);
  console.log('Code:', code);
  console.log('VirtualDataRoomId:', virtualDataRoomId);


  if (!virtualDataRoomId) {
    throw new Error('virtualDataRoomId is required');
  }

  try {
    let transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailTemplatePath = path.join(__dirname, "../email-template-verification-code.html");
    let emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    // Génération du lien de vérification avec les paramètres nécessaires
    const verificationLink = `http://localhost:4200/verify-email?id=${virtualDataRoomId}&email=${email}&code=${code}`;
    emailTemplate = emailTemplate.replace("{{code}}", code);
    emailTemplate = emailTemplate.replace("{{verificationLink}}", verificationLink);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "E-Tafakna Verification Code",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail envoyé à ${email} avec le code de vérification.`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code de vérification :', error);
    throw new Error('Impossible d\'envoyer le code de vérification.');
  }
};

module.exports = sendVerificationCode;
