const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jacinto.hammes@ethereal.email',
        pass: 'QnXKbSZW6yznXs6K8A'
    }
});

