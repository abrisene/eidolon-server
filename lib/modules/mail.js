/*
 # mail.js
 # Email Module
 */

/*
 # Module Dependencies
 */

const config = require('../configs');

/*
 # Critical Variables
 */

const send = async ({ fromName, from, to, subject, text, html }) => {
  try {
    const { domain, client } = config.get('messaging').mailgun;
    const data = {
      from: fromName ? `${fromName} <${from}@${domain}>` : `${from}@${domain}`,
      to,
      subject,
      text,
      html,
    };
    // console.log(data);
    if (!client) throw 'Cannot send email: Client is not configured.';
    return await client.messages.create(domain, data);

  } catch (err) {
    console.error(err);
    return err;
  }
}

/*const sendVerificationToken = async ({ fromName, from, to, subject, text, html, token }) => {
  const { appName, clientUrl } = config.get('environment');
  const verifyUrl = `${clientUrl}/validate/email/${token}`;
  const t = `Please click the link below to ${}`;
  const htm = 
}*/

/*
 # Module Exports
 */

module.exports = {
  send,
};
