import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const maxDuration = 60

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

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g,'_')
    const fileName = `${Date.now()}_${safeName}`

    if(type==='cover' || type==='covers'){
      const { error } = await supabase.storage.from('covers').upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert:true
      })
      if(error) return NextResponse.json({error:`covers bucket error: ${error.message} — Create 'covers' bucket PUBLIC in Supabase Storage!`}, {status:500})
      const {data} = supabase.storage.from('covers').getPublicUrl(fileName)
      
      // Cloudinary backup — non-blocking
      try{
        const res:any = await new Promise((resolve, reject)=>{
          cloudinary.uploader.upload_stream({folder:'bookuniverse/covers'}, (e,r)=> e?reject(e):resolve(r)).end(buffer)
        })
        return NextResponse.json({url:data.publicUrl, path:fileName, cloudinaryUrl:res.secure_url})
      }catch{ 
        return NextResponse.json({url:data.publicUrl, path:fileName}) 
      }
    }

    const bucket = type.includes('audio') ? 'audiobooks' : 'ebooks'
    const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type, upsert:true
    })
    if(error) return NextResponse.json({error:`${bucket} bucket error: ${error.message} — Create '${bucket}' bucket PUBLIC!`}, {status:500})
    
    const {data} = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({url:data.publicUrl, path:fileName})

  }catch(e:any){
    return NextResponse.json({error:e.message}, {status:500})
  }
}
