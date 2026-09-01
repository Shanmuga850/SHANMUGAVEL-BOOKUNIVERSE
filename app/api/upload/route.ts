export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest){
  try{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '').replace(/\/rest\/v1\/?$/, '')
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(url, serviceKey)
    
    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string
    if(!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g,'_').replace(/_+/g,'_')
    const fileName = `${Date.now()}_${safeName}`
    
    let bucket = 'ebooks'
    if(type === 'cover') bucket = 'covers'

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true
    })

    if(error){
      console.error('Upload error:', error)
      return NextResponse.json({ error: `Storage ${bucket} error: ${error.message}` }, { status: 500 })
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({ url: data.publicUrl, path: fileName })
  }catch(e:any){
    console.error('Crash:', e)
    return NextResponse.json({ error: `Crash: ${e.message}` }, { status: 500 })
  }
}
