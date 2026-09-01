export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest){
  try{
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string

    if(!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
    
    let bucket = 'ebooks'
    if(type === 'cover') bucket = 'covers'
    if(type === 'audio') bucket = 'ebooks' // temp store audio in ebooks too for test

    const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true
    })

    if(error){
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({ url: data.publicUrl, path: fileName })
  }catch(e:any){
    console.error('Route crash:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
