"use client"
import { useState, useEffect } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

  useEffect(()=>{
    if(authed){
      supabase.from('ebooks').select('*').order('created_at',{ascending:false}).then(({data})=>setMyEbooks(data||[]))
    }
  },[authed,tab])

  async function uploadToBucket(file: File, bucket: string){
    const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g,'')}`
    const { error } = await supabase.storage.from(bucket).upload(name, file)
    if(error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(name)
    return { url: data.publicUrl, path: name }
  }

  async function handlePublish(){
    if(!title||!pdfFile||!coverFile) return alert('Title, PDF and Cover are required')
    setUploading(true)
    try{
      const pdfRes = await uploadToBucket(pdfFile,'ebooks')
      const coverRes = await uploadToBucket(coverFile,'covers')
      const { error } = await supabase.from('ebooks').insert({
        title, pdf_url: pdfRes.url, pdf_path: pdfRes.path,
        cover_url: coverRes.url, mrp, authors: ['Shanmugavel M'],
        publisher: 'SHANMUGAVEL BOOKUNIVERSE',
        description: 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy'
      })
      if(error) throw error
      alert('Published!')
      setTitle(''); setPdfFile(null); setCoverFile(null); setTab('mybooks')
    }catch(e:any){ alert('Upload failed: '+e.message) }
    setUploading(false)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] grid place-items-center p-6">
        <div className="w-full max-w- rounded- bg-black border border-[#D4AF37]/20 p-8 text-center">
          <div className="flex justify-center mb-4"><CoinLogo size={80} /></div>
          <h1 className="font-serif-lux text- font-bold">SHANMUGAVEL BOOKUNIVERSE</h1>
          <p className="text- uppercase tracking-widest text-[#D4AF37]/70 mt-1">FOUNDER VAULT</p>

          {step===1 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 1: Founder Seal</label>
              <input
                value={seal}
                onChange={e=>setSeal(e.target.value)}
                placeholder="Enter Seal"
                autoComplete="off"
                className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text- outline-none focus:border-[#D4AF37]"
              />
              <button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT')||seal.toUpperCase().includes('FOR 5')) setStep(2); else alert('Invalid Seal')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Unlock</button>
            </div>
          )}

          {step===2 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 2: Email / Password</label>
              <input
                value={email}
                onChange={e=>setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                autoComplete="off"
                className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text- outline-none focus:border-[#D4AF37]/50"
              />
              <input
                type="password"
                value={pwd}
                onChange={e=>setPwd(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text- outline-none focus:border-[#D4AF37]/50"
              />
              <button onClick={()=>{if(email.trim()==='shanmugavelvetri@gmail.com'&&pwd==='VelShanmugam@850') setStep(3); else alert('Invalid')}} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Next</button>
            </div>
          )}

          {step===3 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 3: OTP</label>
              <input
                value={otp}
                onChange={e=>setOtp(e.target.value)}
                placeholder="Enter OTP"
                autoComplete="one-time-code"
                className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text- outline-none focus:border-[#D4AF37]"
              />
              <button onClick={()=>setAuthed(true)} className="mt-4 w-full h-11 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Verify</button>
              <button onClick={()=>setAuthed(true)} className="mt-2 w-full h-10 rounded-full border border-white/10 text- uppercase text-white/60">Bypass</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={48} /><h1 className="font-serif-lux text- font-bold">FOUNDER VAULT</h1></div>
        <div className="flex items-center gap-2"><a href="/" className="h-9 px-4 rounded-full border border-white/10 text- uppercase grid place-items-center">User View</a></div>
      </header>
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/10">
        {[{id:'mybooks',label:'My Books'},{id:'ebooks',label:'Create eBook'},{id:'audiobooks',label:'Create Audiobook'},{id:'dashboard',label:'Dashboard'}].map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} className={`h-9 px-4 rounded-full text- uppercase tracking-widest border ${tab===c.id?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'border-white/10 text-white/60'}`}>{c.label}</button>
        ))}
      </div>
      <div className="p-6 max-w- mx-auto">
        {tab==='mybooks' && (
          <div>
            <div className="flex items-center gap-3 mb-6"><CoinLogo size={48}/><h1 className="font-serif-lux text- font-bold">My Books</h1></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded- bg-black border border-[#D4AF37]/20 overflow-hidden"><div className="px-6 py-4 border-b border-white/5 flex items-center justify-between"><h2 className="font-serif-lux text- font-bold flex items-center gap-2"><CoinLogo size={20}/>Ebooks • {myEbooks.length}</h2><button onClick={()=>setTab('ebooks')} className="h-7 px-3 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase">Add</button></div><div className="p-3 space-y-2">{myEbooks.length===0&&<div className="p-6 text-center text- text-white/30">No ebooks yet</div>}{myEbooks.map((b:any)=><div key={b.id} className="flex gap-3 p-3 rounded- bg-[#0A0A0A] border border-white/5"><img src={b.cover_url} className="w-12 h-16 rounded- object-cover border border-[#D4AF37]/20"/><div className="flex-1"><div className="font-serif-lux text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/40">Rs.{b.mrp}</div></div></div>)}</div></div>
              <div className="rounded- bg-black border border-[#D4AF37]/20 p-8 text-center text- text-white/30">Audiobooks — Next</div>
            </div>
          </div>
        )}
        {tab==='ebooks' && (
          <div className="rounded- bg-black border border-[#D4AF37]/20 p-6">
            <div className="flex items-center gap-2 mb-6"><CoinLogo size={32}/><h2 className="font-serif-lux text- font-bold">Create eBook</h2></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="text- uppercase tracking-widest text-[#D4AF37]">Title*</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text- outline-none"/></div>
              <div><label className="text- uppercase tracking-widest">MRP Rs*</label><input type="number" value={mrp} onChange={e=>setMrp(Number(e.target.value))} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-white/10 text- outline-none"/></div>
              <div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">PDF File*</label><input type="file" accept=".pdf" onChange={e=>setPdfFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/20 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/></div>
              <div className="md:col-span-2"><label className="text- uppercase tracking-widest text-[#D4AF37]">Front Cover JPG*</label><input type="file" accept="image/jpeg,image/jpg,image/png" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="mt-1 w-full h-11 px-4 rounded- bg-black border border-[#D4AF37]/30 text- file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold"/><div className="mt-2 w-20 h-28 rounded- bg-black border border-[#D4AF37]/20 grid place-items-center overflow-hidden">{coverFile?<img src={URL.createObjectURL(coverFile)} className="w-full h-full object-cover"/>:<CoinLogo size={40}/>}</div></div>
            </div>
            <div className="mt-8"><button onClick={handlePublish} disabled={uploading} className="h-11 px-8 rounded-full bg-[#D4AF37] text-black font-bold text- uppercase flex items-center gap-2"><CoinLogo size={20}/>{uploading?'Uploading...':'Publish'}</button></div>
          </div>
        )}
        {tab==='dashboard' && (<div className="grid md:grid-cols-2 gap-6"><div className="rounded- bg-black border border-[#D4AF37]/20 p-6 text-center"><div className="text- uppercase text-[#D4AF37]/60">Total Ebooks</div><div className="text- font-bold">{myEbooks.length}</div></div><div className="rounded- bg-black border border-[#D4AF37]/20 p-6 text-center"><div className="text- uppercase text-[#D4AF37]/60">Status</div><div className="text- font-bold">Live</div></div></div>)}
      </div>
    </div>
  )
}
