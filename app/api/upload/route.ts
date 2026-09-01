export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest){
  try{
    if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
      delete process.env.CLOUDINARY_URL
    }
    const { getCloudinary } = await import('@/lib/cloudinary')
    const cloudinary = getCloudinary()
    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string
    const buffer = Buffer.from(await file.arrayBuffer())
    if(type === 'pdf'){
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g,'')}`
      const { error } = await supabase.storage.from('ebooks').upload(fileName, buffer, { contentType: file.type })
      if(error) return NextResponse.json({ error: error.message }, { status: 500 })
      const { data } = supabase.storage.from('ebooks').getPublicUrl(fileName)
      return NextResponse.json({ url: data.publicUrl, path: fileName })
    } else {
      const folder = type === 'cover'? 'bookuniverse/covers' : 'bookuniverse/audio'
      const result: any = await new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (err:any, res:any)=> err? reject(err) : resolve(res)).end(buffer)
      })
      if(type === 'cover'){
        try{ await supabase.storage.from('covers').upload(`${Date.now()}-${file.name}`, buffer, { contentType: file.type }) }catch{}
      }
      return NextResponse.json({ url: result.secure_url, public_id: result.public_id })
    }
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
