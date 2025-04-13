// sendgridService.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Your SendGrid API key from environment variable

const sendVerificationEmail = async (to, code) => {
    const msg = {
        to,
        from: process.env.EMAIL_BOSSLEVEL, // Your verified sender email on SendGrid
        subject: 'Email Verification Code',
        text: `Your verification code for Oasis Inventory management system is ${code}.`,
        html: `<strong>Your verification code is ${code}.</strong>`, // Optional HTML content
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email.');
    }
};

module.exports = { sendVerificationEmail };
