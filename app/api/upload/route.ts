export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const file = form.get('file') as File
  const type = form.get('type') as string // 'pdf' | 'cover' | 'audio'
  const buffer = Buffer.from(await file.arrayBuffer())

  if(type === 'pdf'){
    // PDF -> Supabase Storage ebooks bucket (Private, but bucket is Public for now)
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('ebooks').upload(fileName, buffer, { contentType: file.type })
    if(error) return NextResponse.json({ error: error.message }, { status: 500 })
    const { data: urlData } = supabase.storage.from('ebooks').getPublicUrl(fileName)
    return NextResponse.json({ url: urlData.publicUrl, path: fileName, public_id: null })
  } else {
    // Cover + Audio -> Cloudinary + also Supabase covers bucket backup
    const folder = type === 'cover'? 'bookuniverse/covers' : 'bookuniverse/audio'
    const result: any = await new Promise((resolve, reject)=>{
      cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (err, res)=> err? reject(err) : resolve(res)).end(buffer)
    })
    // Also backup cover to Supabase covers bucket
    if(type === 'cover'){
      await supabase.storage.from('covers').upload(`${Date.now()}-${file.name}`, buffer, { contentType: file.type })
    }
    return NextResponse.json({ url: result.secure_url, public_id: result.public_id, path: result.public_id })
  }
}
