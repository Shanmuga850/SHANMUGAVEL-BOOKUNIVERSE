import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request){
  try{
    const form = await req.formData()
    const file = form.get('file') as File
    const type = (form.get('type') as string) || 'ebooks'
    if(!file) return NextResponse.json({error:'No file'}, {status:400})
    const buf = Buffer.from(await file.arrayBuffer())

    // COVER = Cloudinary + Supabase backup
    if(type.includes('cover')){
      const res:any = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({folder:'bookuniverse/covers'}, (e,r)=> e?reject(e):resolve(r)).end(buf)
      })
      // Also save to Supabase covers
      try{
        await supabase.storage.from('covers').upload(`${Date.now()}.jpg`, buf, {contentType:'image/jpeg', upsert:true})
      }catch{}
      return NextResponse.json({url: res.secure_url, path: res.public_id})
    }

    // EBOOK / AUDIO = Supabase
    const bucket = type.includes('audio') ? 'audiobooks' : 'ebooks'
    const name = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
    const {error} = await supabase.storage.from(bucket).upload(name, buf, {contentType: file.type, upsert:true})
    if(error) throw new Error(`${bucket}: ${error.message}. Create bucket PUBLIC in Supabase!`)
    const {data} = supabase.storage.from(bucket).getPublicUrl(name)
    return NextResponse.json({url: data.publicUrl, path: name})
  }catch(e:any){
    return NextResponse.json({error:e.message}, {status:500})
  }
}
