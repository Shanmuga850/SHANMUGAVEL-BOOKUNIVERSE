import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request){
  try{
    const form = await req.formData()
    const file = form.get('file') as File
    if(!file) return NextResponse.json({error:'No file'}, {status:400})
    const buf = Buffer.from(await file.arrayBuffer())
    const res:any = await new Promise((resolve,reject)=>{
      cloudinary.uploader.upload_stream(
        { folder: 'bookuniverse/covers', resource_type:'image' },
        (err, result)=> err?reject(err):resolve(result)
      ).end(buf)
    })
    return NextResponse.json({ url: res.secure_url, path: res.public_id, public_id: res.public_id })
  }catch(e:any){
    return NextResponse.json({error:e.message}, {status:500})
  }
}
