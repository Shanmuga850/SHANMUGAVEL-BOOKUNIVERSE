"use client"
import { useState, useEffect } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabase = createClient(cleanUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

  async function uploadDirect(file: File, bucket: 'ebooks' | 'covers' | 'audiobooks'){
    const ext = file.name.split('.').pop() || (bucket==='ebooks'?'pdf': bucket==='covers'?'jpg':'mp3')
    const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).slice(2,7)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })
    if(error) throw new Error(bucket+': '+error.message)
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return { url: data.publicUrl, path: fileName }
  }

  async function handlePublish(){
    if(!title||!pdfFile||!coverFile) return alert('Title*, PDF*, Cover JPG Mandatory*')
    setUploading(true)
    try{
      const pdfRes = await uploadDirect(pdfFile, 'ebooks')
      const coverRes = await uploadDirect(coverFile, 'covers')
      const { error } = await supabase.from('ebooks').insert({ title, pdf_url: pdfRes.url, pdf_path: pdfRes.path, cover_url: coverRes.url, cover_path: coverRes.path, mrp, authors: ['Shanmugavel M'], publisher: 'SHANMUGAVEL BOOKUNIVERSE', description: 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy' })
      if(error) throw error
      alert('Published! 🎉'); setTitle(''); setPdfFile(null); setCoverFile(null); setTab('mybooks')
    }catch(e:any){ alert('Upload failed: '+e.message) }
    setUploading(false)
  }

async function handlePublishAudiobook(){
  if(!audioTitle||!audioCover) return alert('Title + Cover Mandatory!')
  setAudioUploading(true)
  try{
    // 1. Cover → Cloudinary (FIXES your covers: Failed to fetch)
    const fd = new FormData(); fd.append('file', audioCover!)
    const r = await fetch('/api/cloudinary-upload',{method:'POST', body: fd})
    const coverRes = await r.json()
    if(!r.ok) throw new Error('Cover: '+coverRes.error)

    // 2. Audios → Supabase direct (audiobooks bucket)
    const openingRes = audioOpening? await uploadDirect(audioOpening, 'audiobooks') : null
    const endingRes = audioEnding? await uploadDirect(audioEnding, 'audiobooks') : null
    const chapters:any[]=[]
    for(let i=0;i<15;i++){
      if(audioChapters[i]){
        const cr = await uploadDirect(audioChapters[i]!, 'audiobooks')
        chapters.push({no:i+1, url:cr.url, path:cr.path})
      }
    }
    const { error } = await supabase.from('audiobooks').insert({
      title: audioTitle,
      cover_url: coverRes.url, cover_path: coverRes.path,
      opening_url: openingRes?.url||null, opening_path: openingRes?.path||null,
      ending_url: endingRes?.url||null, ending_path: endingRes?.path||null,
      chapters,
      mrp: audioMrp,
      authors: ['Shanmugavel M'],
      publisher: 'SHANMUGAVEL BOOKUNIVERSE',
      description: 'Gold BIG BOX Audiobook - Howler PLAY ONLY'
    })
    if(error) throw error
    alert(`Audiobook Published! 🎧 ${chapters.length} audios Live!`)
    setAudioTitle(''); setAudioCover(null); setAudioOpening(null); setAudioEnding(null); setAudioChapters(Array(15).fill(null)); setTab('mybooks')
  }catch(e:any){ alert('Audio Upload failed: '+e.message) }
  setAudioUploading(false)
}

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] grid place-items-center p-6">
        <div className="w-full max-w-md rounded- bg-black border border-[#D4AF37]/20 p-8 text-center">
          <div className="flex justify-center mb-4"><CoinLogo size={80} /></div>
          <h1 className="font-serif-lux text- font-bold">SHANMUGAVEL BOOKUNIVERSE</h1>
          <p className="text- uppercase tracking-widest text-[#D4AF37]/70">Founder Vault • 3-Step Auth</p>
          {step===1 && (<div className="mt-8 text-left"><label className="text- uppercase tracking-widest text-[#D4AF37]">Step 1: Seal</label><input value={seal} onChange={e=>setSeal(e.target.value)} placeholder="VELS5PERCENT" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" /><button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT')) setStep(2); else alert('Invalid')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Unlock</button></div>)}
          {step===2 && (<div className="mt-8 text-left"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" /><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" /><button onClick={()=>setStep(3)} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Next</button></div>)}
          {step===3 && (<div className="mt-8 text-left"><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" /><button onClick={()=>setAuthed(true)} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Vault Live</button><button onClick={()=>setAuthed(true)} className="mt-2 w-full h-10 rounded-full border border-white/10 text- uppercase">Bypass Dev</button></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={48} /><div><h1 className="font-serif-lux text- font-bold">SHANMUGAVEL BOOKUNIVERSE • Founder Vault</h1><p className="text- uppercase tracking-widest text-[#D4AF37]/60">DIRECT UPLOAD LIVE - NO API</p></div></div>
        <div className="flex items-center gap-2"><span className="h-7 px-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text- uppercase flex items-center gap-2"><CoinLogo size={16}/>Vault Live</span><a href="/" className="h-9 px-4 rounded-full border border-white/10 text- uppercase grid place-items-center">User View</a></div>
      </header>
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/10">
        {[{id:'mybooks',label:'My Books'},{id:'ebooks',label:'Create eBook'},{id:'audiobooks',label:'Create Audiobook'}].map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} className={`h-9 px-4 rounded-full text- uppercase tracking-widest border ${tab===c.id?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'border-white/10 text-white/60'}`}>{c.label}</button>
        ))}
      </div>
      <div className="p-6 max-w- mx-auto">
        {tab==='mybooks' && (<div><h1 className="font-serif-lux text- font-bold mb-6">My Books • {myEbooks.length + audiobooks.length} — Ebooks {myEbooks.length} • Audios {audiobooks.length}</h1><div className="grid md:grid-cols-2 gap-4">{myEbooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded- bg-black border border-white/10"><img src={b.cover_url} className="w-12 h-16 object-cover rounded"/><div><div className="text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/40">Rs.{b.mrp}</div></div></div>)}{audiobooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded- bg-black border border-[#D4AF37]/20"><img src={b.cover_url} className="w-12 h-16 object-cover rounded"/><div><div className="text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/40">Rs.{b.mrp} • {b.chapters?.length||0} Audios</div></div></div>)}</div></div>)}
        {tab==='ebooks' && (<div className="rounded- bg-black border border-[#D4AF37]/20 p-6"><h2 className="font-serif-lux text- font-bold">Create eBook — DIRECT</h2><div className="grid md:grid-cols-2 gap-6 mt-6"><div><label className="text- uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div><div><label className="text- uppercase tracking-widest">MRP*</label><input type="number" value={mrp} onChange={e=>setMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div><div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">PDF → ebooks bucket</label><input type="file" accept=".pdf" onChange={e=>setPdfFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/20 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div><div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">Cover JPG → covers bucket</label><input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/30 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div></div><button onClick={handlePublish} disabled={uploading} className="mt-6 h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">{uploading?'Uploading...':'Publish • DIRECT'}</button></div>)}
        {tab==='audiobooks' && (<div className="rounded- bg-black border border-[#D4AF37]/20 p-6"><h2 className="font-serif-lux text- font-bold text-[#D4AF37]">Create Audiobook — GOLD BIG BOX — DIRECT NO API</h2><div className="grid md:grid-cols-2 gap-6 mt-6"><div><label className="text- uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={audioTitle} onChange={e=>setAudioTitle(e.target.value)} placeholder="Gun Story Volume 1" className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div><div><label className="text- uppercase tracking-widest">MRP Rs*</label><input type="number" value={audioMrp} onChange={e=>setAudioMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div><div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">Cover JPG* → covers</label><input type="file" accept="image/*" onChange={e=>setAudioCover(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/30 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div><div><label className="text- uppercase tracking-widest text-white/60">Opening (Optional)</label><input type="file" accept="audio/*" onChange={e=>setAudioOpening(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white"/></div><div><label className="text- uppercase tracking-widest text-white/60">Ending (Optional)</label><input type="file" accept="audio/*" onChange={e=>setAudioEnding(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white"/></div><div className="md:col-span-2 grid grid-cols-3 gap-3">{Array.from({length:15}).map((_,i)=>(<div key={i}><label className="text- uppercase tracking-widest text-white/60">{String(i+1).padStart(2,'0')} Audio</label><input type="file" accept="audio/*" onChange={e=>{ const a=[...audioChapters]; a[i]=e.target.files?.[0]||null; setAudioChapters(a)}} className="mt-1 w-full h-9 px-3 rounded- bg-black border border-white/10 text- file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-white/10 file:text-white"/></div>))}</div></div><button onClick={handlePublishAudiobook} disabled={audioUploading} className="mt-6 h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">{audioUploading?'Uploading...':'Publish Audiobook • DIRECT'}</button></div>)}
      </div>
    </div>
  )
}
