// api/send.js
require("dotenv").config();
const { Resend } = require("resend");

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone_number, subject, message } = req.body;

    console.log('Received email send request:', { 
      name, 
      email, 
      subject, 
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Present' : 'Missing' 
    });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'www.mcqueens.detailing@hotmail.com',
        subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
        html: `
          <h1>New Message from ${name}</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone_number || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });

      console.log('Email send result:', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
