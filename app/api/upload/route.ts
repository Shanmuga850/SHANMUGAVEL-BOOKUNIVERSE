import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request){
  try{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
    const supabase = createClient(url, serviceKey, { auth:{ persistSession:false } })

    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string // ebook, cover, audiobook, audio-opening, audio-chapter, audio-ending
    if(!file) return NextResponse.json({error:'No file'}, {status:400})

    let bucket = 'ebooks'
    if(type?.includes('cover')) bucket = 'covers'
    if(type?.includes('audio')) bucket = 'audiobooks'

    const ext = file.name.split('.').pop() || (bucket==='covers'?'jpg': bucket==='audiobooks'?'mp3':'pdf')
    const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).slice(2,6)}.${ext}`
    const ab = await file.arrayBuffer()

    // 1. Upload to Supabase (Mumbai or Washington)
    const { error } = await supabase.storage.from(bucket).upload(fileName, ab, { contentType: file.type, upsert:true })
    if(error) return NextResponse.json({error:error.message},{status:400})
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

    // 2. If cover → also upload to Cloudinary auto-folder bookuniverse/covers
    let cloudinaryUrl = null
    if(bucket==='covers'){
      const buf = Buffer.from(ab)
      const uploadRes: any = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({ folder: 'bookuniverse/covers', public_id: fileName.replace(/\.[^/.]+$/, ''), resource_type:'image' },
        (err,res)=> err?reject(err):resolve(res)).end(buf)
      })
      cloudinaryUrl = uploadRes.secure_url
    }

    return NextResponse.json({ url: data.publicUrl, path: fileName, cloudinaryUrl, bucket })

  }catch(e:any){
    return NextResponse.json({error:e.message},{status:500})
  }
}
