const mailjet = require('node-mailjet');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const params = new URLSearchParams(event.body);
  const name = params.get('name');
  const email = params.get('email');
  const message = params.get('message');

  const mailjetClient = mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );

  const request = mailjetClient
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'web.cmdt@gmail.com',   // Replace with a verified sender if needed
            Name: 'CMDT Website',
          },
          To: [
            {
              Email: 'balkhihamza@gmail.com',   // Replace with your destination email
              Name: 'You',
            },
          ],
          Subject: `New Contact Form Submission from ${name}`,
          TextPart: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        },
      ],
    });

  try {
    const result = await request;
    console.log('Mailjet Email Sent:', result.body);
    return {
      statusCode: 200,
      body: 'Message sent successfully!',
    };
  } catch (error) {
    console.error('Mailjet Error:', error);
    return {
      statusCode: 500,
      body: 'Failed to send message.',
    };
  }
};