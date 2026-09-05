import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const maxDuration = 60

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request){
  try{
    const form = await req.formData()
    const file = form.get('file') as File
    const type = (form.get('type') as string) || 'ebooks'
    if(!file) return NextResponse.json({error:'No file uploaded'}, {status:400})

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = file.name.split('.').pop() || 'bin'
    const fileName = `${type}_${Date.now()}_${Math.random().toString(36).slice(2,7)}.${ext}`

    if(type==='cover' || type==='covers'){
      // 1. Upload to Supabase covers (public)
      const { error: supaError } = await supabase.storage.from('covers').upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      })
      if(supaError) throw new Error('covers: '+supaError.message)
      const { data } = supabase.storage.from('covers').getPublicUrl(fileName)
      
      // 2. Backup to Cloudinary bookuniverse/covers
      let cloudinaryUrl = ''
      let cloudinaryId = ''
      try{
        const result:any = await new Promise((resolve, reject)=>{
          cloudinary.uploader.upload_stream(
            { folder: 'bookuniverse/covers', resource_type: 'image' },
            (err, res)=> err? reject(err) : resolve(res)
          ).end(buffer)
        })
        cloudinaryUrl = result.secure_url
        cloudinaryId = result.public_id
      }catch(e){ console.log('Cloudinary backup failed', e) }

      return NextResponse.json({ 
        url: data.publicUrl, 
        path: fileName,
        cloudinaryUrl,
        cloudinaryId,
        public_id: cloudinaryId
      })
    }

    // ebooks or audiobooks
    const bucket = type==='ebooks' || type==='pdf' ? 'ebooks' : type==='audiobooks' || type.includes('audio') ? 'audiobooks' : 'ebooks'
    const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type,
      upsert: true
    })
    if(error) throw new Error(`${bucket}: ${error.message}`)
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({ url: data.publicUrl, path: fileName })

  }catch(e:any){
    console.error('Upload error', e)
    return NextResponse.json({error: e.message || 'Upload failed'}, {status:500})
  }
}
