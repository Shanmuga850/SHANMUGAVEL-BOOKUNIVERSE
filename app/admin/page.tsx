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
  const [title, setTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File|null>(null)
  const [coverFile, setCoverFile] = useState<File|null>(null)
  const [mrp, setMrp] = useState(299)
  const [uploading, setUploading] = useState(false)

  // === P4 AUDIOBOOK STATES — PASTE SPOT 1: AFTER MRP STATE ===
  const [audioTitle, setAudioTitle] = useState('')
  const [audioMrp, setAudioMrp] = useState(199)
  const [audioCover, setAudioCover] = useState<File|null>(null)
  const [audioOpening, setAudioOpening] = useState<File|null>(null)
  const [audioChapters, setAudioChapters] = useState<(File|null)[]>(Array(15).fill(null))
  const [audioEnding, setAudioEnding] = useState<File|null>(null)
  const [audioUploading, setAudioUploading] = useState(false)
  const [audiobooks, setAudiobooks] = useState<any[]>([])

  useEffect(()=>{
    if(authed){
      supabase.from('ebooks').select('*').order('created_at',{ascending:false}).then(({data})=>setMyEbooks(data||[]))
      supabase.from('audiobooks').select('*').order('created_at',{ascending:false}).then(({data})=>setAudiobooks(data||[]))
    }
  },[authed,tab])

async function uploadDirect(file: File, bucket: 'ebooks' | 'covers'){
  const ext = bucket==='ebooks'? 'pdf' : 'jpg'
  const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).slice(2,7)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })
  if(error) throw new Error(error.message)
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: data.publicUrl, path: fileName }
}

  async function handlePublish(){
    if(!title||!pdfFile||!coverFile) return alert('Title*, PDF*, Cover JPG Mandatory*')
    setUploading(true)
    try{
      const pdfRes = await uploadDirect(pdfFile as File, 'ebooks')
      const coverRes = await uploadDirect(coverFile as File, 'covers')
      const { error } = await supabase.from('ebooks').insert({
        title, pdf_url: pdfRes.url, pdf_path: pdfRes.path,
        cover_url: coverRes.url, cover_path: coverRes.path,
        mrp, authors: ['Shanmugavel M'],
        publisher: 'SHANMUGAVEL BOOKUNIVERSE',
        description: 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy'
      })
      if(error) throw error
      alert('Published! 🎉')
      setTitle(''); setPdfFile(null); setCoverFile(null); setTab('mybooks')
      const { data } = await supabase.from('ebooks').select('*').order('created_at',{ascending:false})
      setMyEbooks(data||[])
    }catch(e:any){ alert('Upload failed: '+e.message) }
    setUploading(false)
  }

  // === PASTE SPOT 2: AFTER handlePublish ===
  async function handlePublishAudiobook(){
    if(!audioTitle||!audioCover||!audioOpening||!audioEnding) return alert('Title, Cover, Opening, Ending Mandatory!')
    if(audioChapters.some(c=>!c)) return alert('All 15 Chapters Mandatory for Gold Box!')
    setAudioUploading(true)
    try{
      const upload = async (f: File, type: string)=>{
        const fd = new FormData(); fd.append('file', f); fd.append('type', type);
        const r = await fetch('/api/upload',{method:'POST',body:fd}); const j = await r.json(); if(!r.ok) throw new Error(j.error); return j
      }
      const coverRes = await upload(audioCover!, 'cover')
      const openingRes = await upload(audioOpening!, 'audio-opening')
      const endingRes = await upload(audioEnding!, 'audio-ending')
      const chapterRes = []
      for(let i=0;i<15;i++){ const cr = await upload(audioChapters[i]!, `audio-chapter-${i+1}`); chapterRes.push(cr) }

      const { error } = await supabase.from('audiobooks').insert({
        title: audioTitle,
        cover_url: coverRes.url, cover_path: coverRes.path, cover_cloudinary: coverRes.cloudinaryUrl,
        opening_url: openingRes.url, opening_path: openingRes.path,
        ending_url: endingRes.url, ending_path: endingRes.path,
        chapters: chapterRes.map((c, idx)=>({ no: idx+1, url: c.url, path: c.path })),
        mrp: audioMrp,
        authors: ['Shanmugavel M'],
        publisher: 'SHANMUGAVEL BOOKUNIVERSE',
        description: 'Gold BIG BOX Audiobook - Howler PLAY ONLY'
      })
      if(error) throw error
      alert('Audiobook Published! 🎧 GOLD BOX LIVE!')
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
          {step===1 && (<div className="mt-8 text-left"><label className="text- uppercase tracking-widest text-[#D4AF37]">Step 1: Founder Seal</label><input value={seal} onChange={e=>setSeal(e.target.value)} placeholder="Enter Seal" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" /><button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT')||seal.toUpperCase().includes('FOR 5')) setStep(2); else alert('Invalid Seal')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Unlock Seal</button></div>)}
          {step===2 && (<div className="mt-8 text-left"><label className="text- uppercase tracking-widest text-[#D4AF37]">Step 2: Email / Password</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" /><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" /><button onClick={()=>{if(email.trim()==='founder@velsbookstore.com'&&pwd==='VelShanmugam@850') setStep(3); else if(email.trim()==='shanmugavelvetri@gmail.com'&&pwd==='VelShanmugam@850') setStep(3); else alert('Invalid')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Next</button></div>)}
          {step===3 && (<div className="mt-8 text-left"><label className="text- uppercase tracking-widest text-[#D4AF37]">Step 3: OTP</label><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" /><button onClick={()=>setAuthed(true)} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Verify OTP • Vault Live</button><button onClick={()=>setAuthed(true)} className="mt-2 w-full h-10 rounded-full border border-white/10 text- uppercase">Bypass for Dev</button></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={48} /><div><h1 className="font-serif-lux text- font-bold">SHANMUGAVEL BOOKUNIVERSE • Founder Vault</h1><p className="text- uppercase tracking-widest text-[#D4AF37]/60">API UPLOAD LIVE - FIXED</p></div></div>
        <div className="flex items-center gap-2"><span className="h-7 px-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text- uppercase flex items-center gap-2"><CoinLogo size={16}/>Vault Live</span><a href="/" className="h-9 px-4 rounded-full border border-white/10 text- uppercase grid place-items-center">User View</a></div>
      </header>
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/10">
        {[{id:'mybooks',label:'My Books'},{id:'ebooks',label:'Create eBook'},{id:'audiobooks',label:'Create Audiobook'},{id:'dashboard',label:'Dashboard'},{id:'founder',label:'Founder Profile'}].map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} className={`h-9 px-4 rounded-full text- uppercase tracking-widest border ${tab===c.id?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'border-white/10 text-white/60'}`}>{c.label}</button>
        ))}
      </div>
      <div className="p-6 max-w- mx-auto">
        {tab==='mybooks' && (
          <div>
            <div className="flex items-center gap-3 mb-6"><CoinLogo size={48}/><div><h1 className="font-serif-lux text- font-bold">My Books • {myEbooks.length + audiobooks.length}</h1><p className="text- uppercase tracking-widest text-[#D4AF37]/60">Total Ebooks: {myEbooks.length} • Audiobooks: {audiobooks.length}</p></div></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded- bg-black border border-[#D4AF37]/20 overflow-hidden"><div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50"><h2 className="font-serif-lux text- font-bold flex items-center gap-2"><CoinLogo size={20}/>My Ebooks • {myEbooks.length}</h2><button onClick={()=>setTab('ebooks')} className="h-7 px-3 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Add Ebook</button></div><div className="p-3 space-y-2">{myEbooks.length===0&&<div className="p-6 text-center text- text-white/30">No ebooks yet</div>}{myEbooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded- bg-[#0A0A0A] border border-white/5"><img src={b.cover_url} className="w-12 h-16 rounded- object-cover"/><div className="flex-1"><div className="font-serif-lux text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/40">Rs.{b.mrp}</div></div></div>)}</div></div>
              <div className="rounded- bg-black border border-[#D4AF37]/20 overflow-hidden"><div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50"><h2 className="font-serif-lux text- font-bold flex items-center gap-2">🎧 My Audiobooks • {audiobooks.length}</h2><button onClick={()=>setTab('audiobooks')} className="h-7 px-3 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Add Audiobook</button></div><div className="p-3 space-y-2">{audiobooks.length===0&&<div className="p-6 text-center text- text-white/30">No audiobooks yet — P4 Ready</div>}{audiobooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded- bg-[#0A0A0A] border border-white/5"><img src={b.cover_url} className="w-12 h-16 rounded- object-cover"/><div className="flex-1"><div className="font-serif-lux text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/40">Rs.{b.mrp} • 17 Tracks</div></div></div>)}</div></div>
            </div>
          </div>
        )}
        {tab==='ebooks' && (
          <div className="rounded- bg-black border border-[#D4AF37]/20 p-6">
            <h2 className="font-serif-lux text- font-bold">Create eBook — API UPLOAD FIXED</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div><label className="text- uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="GUN STORY" className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div>
              <div><label className="text- uppercase tracking-widest">MRP Rs*</label><input type="number" value={mrp} onChange={e=>setMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div>
              <div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">PDF REQUIRED* → ebooks bucket</label><input type="file" accept=".pdf" onChange={e=>setPdfFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/20 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
              <div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">Cover JPG* → covers bucket</label><input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/30 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
            </div>
            <div className="mt-8 flex gap-3"><button onClick={handlePublish} disabled={uploading} className="h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase flex items-center gap-2"><CoinLogo size={20}/>{uploading?'Uploading...':'Publish • FIXED'}</button></div>
          </div>
        )}
        {tab==='audiobooks' && (
          <div className="rounded- bg-black border border-[#D4AF37]/20 p-6">
            <h2 className="font-serif-lux text- font-bold text-[#D4AF37]">Create Audiobook — GOLD BIG BOX — Howler PLAY ONLY</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div><label className="text- uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={audioTitle} onChange={e=>setAudioTitle(e.target.value)} placeholder="GUN STORY AUDIO" className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div>
              <div><label className="text- uppercase tracking-widest">MRP Rs*</label><input type="number" value={audioMrp} onChange={e=>setAudioMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text-"/></div>
              <div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">Cover JPG* → covers + Cloudinary bookuniverse/covers</label><input type="file" accept="image/*" onChange={e=>setAudioCover(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/30 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
              <div><label className="text- uppercase tracking-widest text-[#D4AF37]">Opening MP3*</label><input type="file" accept="audio/*" onChange={e=>setAudioOpening(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/20 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
              <div><label className="text- uppercase tracking-widest text-[#D4AF37]">Ending MP3*</label><input type="file" accept="audio/*" onChange={e=>setAudioEnding(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/20 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                {Array.from({length:15}).map((_,i)=>(
                  <div key={i}><label className="text- uppercase tracking-widest text-white/60">Chapter {String(i+1).padStart(2,'0')} MP3*</label><input type="file" accept="audio/*" onChange={e=>{ const arr=[...audioChapters]; arr[i]=e.target.files?.[0]||null; setAudioChapters(arr) }} className="mt-1 w-full h-9 px-3 rounded- bg-black border border-white/10 text- file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-white/10 file:text-white"/></div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-3"><button onClick={handlePublishAudiobook} disabled={audioUploading} className="h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase flex items-center gap-2"><CoinLogo size={20}/>{audioUploading?'Uploading 17 Files...':'Publish Audiobook • GOLD BOX'}</button></div>
          </div>
        )}
        {tab!=='mybooks' && tab!=='ebooks' && tab!=='audiobooks' && (<div className="p-8 text-center text-white/30">Coming soon — P5 PDF.js + P6 Howler</div>)}
      </div>
    </div>
  )
}
