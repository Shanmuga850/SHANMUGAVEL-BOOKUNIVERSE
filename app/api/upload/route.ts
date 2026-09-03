import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL||'').trim()
    const url = raw.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY||'').trim()
    if(!url || !serviceKey) return NextResponse.json({error:'Missing ENV keys'},{status:500})

    const supabase = createClient(url, serviceKey)
    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string
    const bucket = type==='cover' ? 'covers' : 'ebooks'
    
    const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).slice(2,6)}.${bucket==='ebooks'?'pdf':'jpg'}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true
    })
    if(error) throw new Error(error.message)
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({ url: data.publicUrl, path: fileName })
  }catch(e:any){
    return NextResponse.json({ error: e.message }, {status:500})
  }
}
