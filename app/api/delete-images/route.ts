import { NextResponse, NextRequest } from 'next/server'
import * as https from 'https'

export async function POST(req: NextRequest) {
  try {
    const { fileIds } = await req.json()

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'fileIds array is required' },
        { status: 400 }
      )
    }

    const response = await deleteFilesFromImageKit(fileIds)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting files:', error)
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    )
  }
}

async function deleteFilesFromImageKit(fileIds: string[]) {
  const options = {
    method: 'POST',
    hostname: 'api.imagekit.io',
    path: '/v1/files/batch/deleteByFileIds',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Replace with your actual ImageKit private API key
      // Note: In production, store this in environment variables
      Authorization: `Basic ${Buffer.from(
        `${process.env.IMAGEKIT_PRIVATE_KEY}:`
      ).toString('base64')}`,
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(JSON.stringify({ fileIds }))
    req.end()
  })
}
