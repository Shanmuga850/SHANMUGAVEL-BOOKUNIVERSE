export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
  try{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if(!url || !serviceKey){
      return NextResponse.json({ error: `Missing ENV: url=${!!url} service=${!!serviceKey}` }, { status: 500 })
    }

    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string
    if(!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
    
    let bucket = 'ebooks'
    if(type === 'cover') bucket = 'covers'

    // DIRECT REST UPLOAD - bypasses supabase-js fetch failed bug
    const uploadUrl = `${url}/storage/v1/object/${bucket}/${fileName}`
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'x-upsert': 'true',
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: buffer as any
    })

    if(!res.ok){
      const txt = await res.text()
      console.error('Supabase REST error', res.status, txt)
      return NextResponse.json({ error: `Storage ${bucket} ${res.status}: ${txt}` }, { status: 500 })
    }

    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${fileName}`
    return NextResponse.json({ url: publicUrl, path: fileName })
  }catch(e:any){
    console.error('Route crash:', e)
    return NextResponse.json({ error: `Crash: ${e.message} | cause: ${e.cause?.message || e.cause}` }, { status: 500 })
  }
}
