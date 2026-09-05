// Cloudflare R2 - S3 compatible - Signed URLs <10min expiry
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function getSignedReadUrl(key: string, expiresIn = 600) {
  // 600s = 10 min expiry - READ/PLAY ONLY No Download
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  })
  return await getSignedUrl(r2Client, command, { expiresIn })
}

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  })
  await r2Client.send(command)
  return key
}

// Front Cover JPG = First Page merge logic - to be used in API route
// import { PDFDocument } from 'pdf-lib'
// 1. Load cover JPG, 2. Load PDF, 3. Convert JPG to PDF page, 4. Insert as page 0
