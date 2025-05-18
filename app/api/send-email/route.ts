import { sendMail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await request.json()
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
    case 'TradeIn':
      subject = 'New Trade-In Form Submission'
      html = `
        <h3>Trade-In Form</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Cellphone:</strong> ${formData.cellphone}</p>
        <p><strong>Alt Number:</strong> ${formData.altNumber}</p>
        <p><strong>Town:</strong> ${formData.town}</p>
        <p><strong>Make:</strong> ${formData.make}</p>
        <p><strong>Model:</strong> ${formData.model}</p>
        <p><strong>Year:</strong> ${formData.year}</p>
        <p><strong>Mileage:</strong> ${formData.mileage}</p>
        <p><strong>Price Range:</strong> ${formData.price}</p>
        <p><strong>Description:</strong> ${formData.description}</p>
        <p><strong>Additional Comments:</strong> ${formData.comments}</p>
        <p><strong>Images:</strong> ${formData.tradeImages}</p>
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
      })
  }

  try {
    await sendMail({ subject, html })
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
    })
  }
}
