import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL||'').trim()
    const cleanUrl = raw.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY||'').trim()
    
    if(!cleanUrl || !serviceKey){
      return NextResponse.json({error:'ENV missing: URL or SERVICE_ROLE_KEY not set in Vercel'}, {status:500})
    }

    const form = await req.formData()
    const file = form.get('file') as File
    const type = form.get('type') as string
    if(!file) return NextResponse.json({error:'No file received'}, {status:400})

    const bucket = type==='cover' ? 'covers' : 'ebooks'
    const ext = bucket==='ebooks' ? 'pdf' : 'jpg'
    const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).slice(2,6)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // DIRECT REST upload - No supabase-js - No fetch failed!
    const uploadUrl = `${cleanUrl}/storage/v1/object/${bucket}/${fileName}`
    
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'x-upsert': 'true',
        'Content-Type': file.type || (bucket==='ebooks'?'application/pdf':'image/jpeg')
      },
      body: buffer
    })

    if(!uploadRes.ok){
      const errText = await uploadRes.text()
      return NextResponse.json({error:`Supabase storage error: ${uploadRes.status} ${errText}`},{status:400})
    }

    const publicUrl = `${cleanUrl}/storage/v1/object/public/${bucket}/${fileName}`
    return NextResponse.json({ url: publicUrl, path: fileName })

  }catch(e:any){
    return NextResponse.json({error:`Server crash: ${e.message}`},{status:500})
  }
}
