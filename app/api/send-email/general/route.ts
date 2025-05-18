import { sendMail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, ...formData } = body

    let subject = ''
    let html = ''

    switch (type) {
      case 'Enquiry':
        subject = 'New Enquiry Form Submission'
        html = `
          <h3>Enquiry Form</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Contact Number:</strong> ${formData.phone}</p>
          <p><strong>Message:</strong> ${formData.message}</p>
        `
        break
      case 'Contact':
        subject = 'New Contact Form Submission'
        html = `
          <h3>Contact Form</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Location:</strong> ${formData.location}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Comment:</strong> ${formData.comment}</p>
        `
        break
      default:
        return new Response(JSON.stringify({ message: 'Unknown form type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
    }

    await sendMail({ subject, html })

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}
