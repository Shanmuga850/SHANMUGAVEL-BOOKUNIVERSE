
"use client"
import { useState, useEffect } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Admin() {
  const [step, setStep] = useState(1)
  const [seal, setSeal] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [otp, setOtp] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('mybooks')
  const [myEbooks, setMyEbooks] = useState<any[]>([])
  const [audiobooks, setAudiobooks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File|null>(null)
  const [coverFile, setCoverFile] = useState<File|null>(null)
  const [mrp, setMrp] = useState(299)
  const [uploading, setUploading] = useState(false)
  const [audioTitle, setAudioTitle] = useState('')
  const [audioMrp, setAudioMrp] = useState(11)
  const [audioCover, setAudioCover] = useState<File|null>(null)
  const [audioOpening, setAudioOpening] = useState<File|null>(null)
  const [audioEnding, setAudioEnding] = useState<File|null>(null)
  const [audioChapters, setAudioChapters] = useState<(File|null)[]>(Array(15).fill(null))
  const [audioUploading, setAudioUploading] = useState(false)

  useEffect(()=>{
    if(authed){
      supabase.from('ebooks').select('*').order('created_at',{ascending:false}).then(({data})=>setMyEbooks(data||[]))
      supabase.from('audiobooks').select('*').order('created_at',{ascending:false}).then(({data})=>setAudiobooks(data||[]))
    }
  },[authed,tab])

  async function uploadServer(file: File, type: 'ebooks' | 'cover' | 'audiobooks'){
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    const r = await fetch('/api/upload',{method:'POST', body: fd})
    const j = await r.json()
    if(!r.ok) throw new Error(j.error || 'Upload failed')
    return j
  }

  async function handlePublish(){
    if(!title||!pdfFile||!coverFile) return alert('Title*, PDF*, Cover JPG Mandatory*')
    setUploading(true)
    try{
      const pdfRes = await uploadServer(pdfFile, 'ebooks')
      const coverRes = await uploadServer(coverFile, 'cover')
      const { error } = await supabase.from('ebooks').insert({
        title, pdf_url: pdfRes.url, pdf_path: pdfRes.path,
        cover_url: coverRes.url, cover_path: coverRes.path, cover_cloudinary: coverRes.cloudinaryUrl || null,
        mrp, authors: ['Shanmugavel M'], publisher: 'SHANMUGAVEL BOOKUNIVERSE',
        description: 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy'
      })
      if(error) throw error
      alert('Published! Ebook Live on Front Page!')
      setTitle(''); setPdfFile(null); setCoverFile(null); setTab('mybooks')
      const { data } = await supabase.from('ebooks').select('*').order('created_at',{ascending:false})
      setMyEbooks(data||[])
    }catch(e:any){ alert('Upload failed: '+e.message) }
    setUploading(false)
  }

  async function handlePublishAudiobook(){
    if(!audioTitle||!audioCover) return alert('Title + Cover Mandatory!')
    setAudioUploading(true)
    try{
      const coverRes = await uploadServer(audioCover!, 'cover')
      const openingRes = audioOpening? await uploadServer(audioOpening, 'audiobooks') : null
      const endingRes = audioEnding? await uploadServer(audioEnding, 'audiobooks') : null
      const chapters:any[]=[]
      for(let i=0;i<15;i++){
        if(audioChapters[i]){
          const cr = await uploadServer(audioChapters[i]!, 'audiobooks')
          chapters.push({no:i+1, url:cr.url, path:cr.path})
        }
      }
      const { error } = await supabase.from('audiobooks').insert({
        title: audioTitle, cover_url: coverRes.url, cover_path: coverRes.path, cover_cloudinary: coverRes.cloudinaryUrl,
        opening_url: openingRes?.url||null, opening_path: openingRes?.path||null,
        ending_url: endingRes?.url||null, ending_path: endingRes?.path||null,
        chapters, mrp: audioMrp, authors: ['Shanmugavel M'], publisher: 'SHANMUGAVEL BOOKUNIVERSE',
        description: 'Gold BIG BOX Audiobook - Howler PLAY ONLY'
      })
      if(error) throw error
      alert(`Audiobook Published! ${chapters.length} audios Live!`)
      setAudioTitle(''); setAudioCover(null); setAudioOpening(null); setAudioEnding(null); setAudioChapters(Array(15).fill(null)); setTab('mybooks')
    }catch(e:any){ alert('Audio Upload failed: '+e.message) }
    setAudioUploading(false)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] grid place-items-center p-6">
        <div className="w-full max-w-md rounded-[16px] bg-black border border-[#D4AF37]/20 p-8 text-center">
          <div className="flex justify-center mb-4"><CoinLogo size={80} /></div>
          <h1 className="font-serif-lux text-[18px] font-bold">SHANMUGAVEL BOOKUNIVERSE</h1>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/70">Founder Vault • 3-Step Auth • OTP LAST</p>
          {step===1 && (<div className="mt-8 text-left"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 1: Founder Seal VELS5PERCENT</label><input value={seal} onChange={e=>setSeal(e.target.value)} placeholder="VELS5PERCENT" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-[13px]" /><button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT')) setStep(2); else alert('Invalid Seal')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase">Unlock Seal</button></div>)}
          {step===2 && (<div className="mt-8 text-left"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 2: Email founder@velsbookstore.com</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="founder@velsbookstore.com" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-[13px]" /><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="founder123" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-[13px]" /><button onClick={()=>{if(email.trim()==='founder@velsbookstore.com') setStep(3); else alert('Use founder@velsbookstore.com')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase">Next</button></div>)}
          {step===3 && (<div className="mt-8 text-left"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 3: OTP LAST (P14)</label><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter any OTP" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-[13px]" /><button onClick={()=>setAuthed(true)} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase">Verify OTP • Vault Live</button><button onClick={()=>setAuthed(true)} className="mt-2 w-full h-10 rounded-full border border-white/10 text-[11px] uppercase">Bypass for Dev</button></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={48} /><div><h1 className="font-serif-lux text-[14px] font-bold">SHANMUGAVEL BOOKUNIVERSE • Founder Vault</h1><p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60">SERVER UPLOAD LIVE - FIXED CORS</p></div></div>
        <div className="flex items-center gap-2"><span className="h-7 px-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[10px] uppercase flex items-center gap-2"><CoinLogo size={16}/>Vault Live</span><a href="/" className="h-9 px-4 rounded-full border border-white/10 text-[11px] uppercase grid place-items-center">User View</a></div>
      </header>
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/10">
        {[{id:'mybooks',label:'My Books'},{id:'ebooks',label:'Create eBook'},{id:'audiobooks',label:'Create Audiobook'}].map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} className={`h-9 px-4 rounded-full text-[11px] uppercase tracking-widest border ${tab===c.id?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'border-white/10 text-white/60'}`}>{c.label}</button>
        ))}
      </div>
      <div className="p-6 max-w-[1200px] mx-auto">
        {tab==='mybooks' && (<div><h1 className="font-serif-lux text-[18px] font-bold mb-6">My Books • {myEbooks.length + audiobooks.length}</h1><div className="grid md:grid-cols-2 gap-4">{myEbooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded-[12px] bg-black border border-white/10"><img src={b.cover_url} className="w-12 h-16 object-cover rounded"/><div><div className="text-[13px] font-bold text-[#D4AF37]">{b.title}</div><div className="text-[11px] text-white/40">Rs.{b.mrp}</div></div></div>)}{audiobooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded-[12px] bg-black border border-[#D4AF37]/20"><img src={b.cover_url} className="w-12 h-16 object-cover rounded"/><div><div className="text-[13px] font-bold text-[#D4AF37]">{b.title}</div><div className="text-[11px] text-white/40">Rs.{b.mrp} • {b.chapters?.length||0} Audios</div></div></div>)}</div></div>)}
        {tab==='ebooks' && (<div className="rounded-[16px] bg-black border border-[#D4AF37]/20 p-6"><h2 className="font-serif-lux text-[16px] font-bold">Create eBook — SERVER FIXED — P3 DONE</h2><div className="grid md:grid-cols-2 gap-6 mt-6"><div><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"/></div><div><label className="text-[11px] uppercase tracking-widest">MRP*</label><input type="number" value={mrp} onChange={e=>setMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"/></div><div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">PDF → ebooks bucket via /api/upload</label><input type="file" accept=".pdf" onChange={e=>setPdfFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/20 text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div><div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Cover JPG → covers + Cloudinary</label><input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div></div><button onClick={handlePublish} disabled={uploading} className="mt-6 h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase">{uploading?'Uploading via Server...':'Publish • SERVER FIXED'}</button></div>)}
        {tab==='audiobooks' && (<div className="rounded-[16px] bg-black border border-[#D4AF37]/20 p-6 opacity-60"><h2 className="font-serif-lux text-[16px] font-bold text-[#D4AF37]">Create Audiobook — P4 NEXT</h2><div className="grid md:grid-cols-2 gap-6 mt-6"><div><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={audioTitle} onChange={e=>setAudioTitle(e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"/></div><div><label className="text-[11px] uppercase tracking-widest">MRP*</label><input type="number" value={audioMrp} onChange={e=>setAudioMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"/></div><div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Cover JPG* → via Server</label><input type="file" accept="image/*" onChange={e=>setAudioCover(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div></div><button onClick={handlePublishAudiobook} disabled={audioUploading} className="mt-6 h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase">{audioUploading?'Uploading...':'Publish Audiobook • SERVER'}</button></div>)}
      </div>
    </div>
  )
}
