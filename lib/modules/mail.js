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

const send = async ({
  fromName, from, to, subject, text, html,
}) => {
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
    if (!client) throw new Error('Cannot send email: Client is not configured.');
    return await client.messages.create(domain, data);
  } catch (err) {
    console.error(err);
    return err;
  }
};

/*
 # Module Exports
 */

module.exports = {
  send,
};
