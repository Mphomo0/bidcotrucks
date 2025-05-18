import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/email'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract all form fields
    const name = formData.get('name')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const cellphone = formData.get('cellphone')?.toString() || ''
    const altNumber = formData.get('altNumber')?.toString() || ''
    const town = formData.get('town')?.toString() || ''
    const make = formData.get('make')?.toString() || ''
    const model = formData.get('model')?.toString() || ''
    const year = formData.get('year')?.toString() || ''
    const mileage = formData.get('mileage')?.toString() || ''
    const price = formData.get('price')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const comments = formData.get('comments')?.toString() || ''

    // Multiple files (e.g. images)
    const tradeImages = formData.getAll('tradeImages') as File[]

    // Convert each file stream to Buffer
    const attachments = await Promise.all(
      tradeImages.map(async (file) => {
        const stream = Readable.fromWeb(file.stream() as ReadableStream)
        const chunks: Uint8Array[] = []

        for await (const chunk of stream) {
          chunks.push(chunk)
        }

        return {
          filename: file.name,
          content: Buffer.concat(chunks),
        }
      })
    )

    // Send email
    await sendMail({
      subject: 'New Trade-In Form Submission',
      html: `
        <h2>Trade-In Form Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cellphone:</strong> ${cellphone}</p>
        <p><strong>Alternative Number:</strong> ${altNumber}</p>
        <p><strong>Town:</strong> ${town}</p>
        <p><strong>Make:</strong> ${make}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Mileage:</strong> ${mileage}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Description:</strong> ${
          description || 'No description provided'
        }</p>
        <p><strong>Comments:</strong> ${comments || 'No comments provided'}</p>
      `,
      attachments,
    })

    return NextResponse.json(
      { message: 'Form received successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error parsing form:', error)
    return NextResponse.json(
      { message: 'Server error while processing form' },
      { status: 500 }
    )
  }
}
