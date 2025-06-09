import nodemailer from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'

// Create the transporter using Webmail SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., mail.yourdomain.com
  port: Number(process.env.SMTP_PORT), // 465 (SSL) or 587 (TLS)
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // your Webmail email address
    pass: process.env.SMTP_PASS, // your Webmail password
  },
})

// Define the expected input for sending an email
interface SendMailParams {
  subject: string
  html: string
  to?: string
  attachments?: Attachment[]
}

// Send the email
export async function sendMail({
  subject,
  html,
  to = 'admin@bidco.co.za', // default recipient
  attachments = [],
}: SendMailParams) {
  // Validate credentials are provided
  if (
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT
  ) {
    throw new Error('Missing SMTP configuration in environment variables')
  }

  try {
    const info = await transporter.sendMail({
      from: `"Website Form" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
