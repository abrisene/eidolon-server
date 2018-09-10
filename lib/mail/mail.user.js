/*
 # mail.user.js
 # User Mail Templates
 */

const getGenerator = require('./generator');
const config = require('../configs');

/**
 # Module Dependencies
 */

/**
 # Module Dependencies
 */

const generateEmailValidationEmail = async ({ to, token }) => {
  const { appName, clientUrl } = config.get('environment');
  const generator = getGenerator();

  const template = {
    body: {
      title: `Welcome to ${appName}`,
      action: {
        instructions: 'Please click the button below to verify your email adddress:',
        button: {
          color: '#007bff',
          text: 'Verify',
          link: `${clientUrl}/validate/email/${token}`,
        },
      },
      signature: 'Regards',
    },
  };

  return {
    to,
    from: 'noreply',
    subject: `${appName}: Please Verify Your Email`,
    html: generator.generate(template),
    text: generator.generatePlaintext(template),
  };
};


const generatePasswordResetEmail = async ({ to, token }) => {
  const { appName, clientUrl } = config.get('environment');
  const generator = getGenerator();

  const template = {
    body: {
      title: `Reset Your ${appName} Password`,
      intro: 'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
          color: '#007bff',
          text: 'Reset',
          link: `${clientUrl}/recover/${token}`,
        },
      },
      outro: 'If you did not request a password reset, no further action is required on your part.',
      signature: 'Regards',
    },
  };

  return {
    to,
    from: 'noreply',
    subject: `Reset Your ${appName} Password`,
    html: generator.generate(template),
    text: generator.generatePlaintext(template),
  };
};

/**
 # Module Exports
 */

module.exports = {
  generateEmailValidationEmail,
  generatePasswordResetEmail,
};
