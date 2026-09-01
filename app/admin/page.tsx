"use client"
import { useState } from 'react'
import { CoinLogo } from '@/components/CoinLogo'

export default function Admin() {
  const [step, setStep] = useState(1)
  const [seal, setSeal] = useState('')
  const [email, setEmail] = useState('founder@velsbookstore.com')
  const [pwd, setPwd] = useState('')
  const [otp, setOtp] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('mybooks')

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] grid place-items-center p-6">
        <div className="w-full max-w-[420px] rounded-[20px] black-gold-card p-8 text-center">
          <div className="flex justify-center mb-4"><CoinLogo size={80} /></div>
          <h1 className="font-serif-lux text-[24px] font-bold">SHANMUGAVEL BOOKUNIVERSE</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70">Founder Vault • Private • 3-Step Auth • Coin Logo Mandatory</p>
          
          {step===1 && (
            <div className="mt-8 text-left">
              <label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 1: Founder Seal Password</label>
              <p className="text-[10px] text-white/40 mt-1">Hint: Try VELS5PERCENT or FOR 5% THINKERS — this is Seal Password, not email password.</p>
              <input value={seal} onChange={e=>setSeal(e.target.value)} placeholder="Enter Seal Password" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-[13px]" />
              <button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT') || seal.toUpperCase().includes('FOR 5')) setStep(2); else alert('Invalid Seal')}} className="mt-4 w-full h-11 rounded-full gold-gradient text-black font-bold text-[12px] uppercase">Unlock Seal • Coin Logo</button>
            </div>
          )}
          {step===2 && (
            <div className="mt-8 text-left">
              <label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 2: Email / Password</label>
              <p className="text-[10px] text-white/40 mt-1">Different from Step 1 Seal Password • Instant • Founder Shanmugavel M</p>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-[13px]" />
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="founder123" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-[13px]" />
              <button onClick={()=>setStep(3)} className="mt-4 w-full h-11 rounded-full gold-gradient text-black font-bold text-[12px] uppercase">Next • Email Verify</button>
            </div>
          )}
          {step===3 && (
            <div className="mt-8 text-left">
              <label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Step 3: Email Verification - OTP</label>
              <p className="text-[10px] text-white/40 mt-1">OTP will be sent to founder@velsbookstore.com — 6-digit code. Currently bypass allowed for development.</p>
              <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-[13px]" />
              <button onClick={()=>setAuthed(true)} className="mt-4 w-full h-11 rounded-full gold-gradient text-black font-bold text-[12px] uppercase">Verify OTP • Vault Live • 3-Step Done</button>
              <button onClick={()=>setAuthed(true)} className="mt-2 w-full h-10 rounded-full border border-white/10 text-[11px] uppercase">Bypass for Dev (Coin Logo Mandatory)</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={48} /><div><h1 className="font-serif-lux text-[18px] font-bold">SHANMUGAVEL BOOKUNIVERSE • Founder Vault</h1><p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60">Unlocked • For 5% THINKERS • Seal + Email + OTP • Coin Logo Mandatory</p></div></div>
        <div className="flex items-center gap-2"><span className="h-7 px-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[10px] uppercase flex items-center gap-2"><CoinLogo size={16} />Vault Live • 3-Step Done</span><a href="/" className="h-9 px-4 rounded-full border border-white/10 text-[11px] uppercase">User View</a></div>
      </header>

      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/10">
        {[{id:'mybooks',label:'My Books'},{id:'ebooks',label:'Create eBook'},{id:'audiobooks',label:'Create Audiobook'},{id:'dashboard',label:'Dashboard'},{id:'founder',label:'Founder Profile'}].map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} className={`h-9 px-4 rounded-full text-[11px] uppercase tracking-widest border ${tab===c.id?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'border-white/10 text-white/60'}`}>{c.label}</button>
        ))}
      </div>

      <div className="p-6 max-w-[1200px] mx-auto">
        {tab==='mybooks' && (
          <div>
            <div className="flex items-center justify-center gap-3 mb-8"><CoinLogo size={48} /><div className="text-center"><h1 className="font-serif-lux text-[28px] font-bold">My Books</h1><p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60">Black & Gold Luxury • For 5% THINKERS • Shanmugavel M • GUN STORY Example • Coin Logo Mandatory</p></div></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[20px] black-gold-card overflow-hidden"><div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50"><h2 className="font-serif-lux text-[18px] font-bold flex items-center gap-2"><CoinLogo size={20} />My Ebooks</h2><button onClick={()=>setTab('ebooks')} className="h-7 px-3 rounded-full gold-gradient text-black font-bold text-[10px] uppercase">Add Ebook</button></div><div className="p-3"><div className="text-[11px] uppercase tracking-widest text-[#D4AF37]/60 font-bold mb-2">Drafts • 0</div><div className="p-4 rounded-[12px] bg-black border border-white/5 text-center text-[11px] text-white/30">No drafts • Your unfinished ebooks here</div><div className="mt-4 text-[11px] uppercase tracking-widest text-[#D4AF37]/60 font-bold mb-2">Existing Books • 4</div><div className="space-y-2">{['GUN STORY','Fairy Guides','Whale Wisdom','5% Thinkers'].map(t=><div key={t} className="flex gap-3 p-3 rounded-[12px] bg-black border border-white/5"><div className="w-12 h-16 rounded-[6px] bg-[#0A0A0A] border border-[#D4AF37]/20 grid place-items-center"><CoinLogo size={28} /></div><div className="flex-1"><div className="font-serif-lux text-[13px] font-bold text-[#D4AF37]">{t}</div><div className="text-[10px] text-white/40">GUNSTORY style • Rs.299 • SKU:GUN-001 • Shanmugavel M</div></div><div className="flex gap-1"><button className="h-6 px-2 rounded-full border border-white/10 text-[9px] uppercase">Edit</button></div></div>)}</div></div></div>
              <div className="rounded-[20px] black-gold-card overflow-hidden"><div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50"><h2 className="font-serif-lux text-[18px] font-bold flex items-center gap-2"><CoinLogo size={20} />My Audiobooks</h2><button onClick={()=>setTab('audiobooks')} className="h-7 px-3 rounded-full gold-gradient text-black font-bold text-[10px] uppercase">Add Audiobook</button></div><div className="p-3"><div className="text-[11px] uppercase tracking-widest text-[#D4AF37]/60 font-bold mb-2">Drafts • 0</div><div className="p-4 rounded-[12px] bg-black border border-white/5 text-center text-[11px] text-white/30">No drafts • Your unfinished audiobooks here</div><div className="mt-4 text-[11px] uppercase tracking-widest text-[#D4AF37]/60 font-bold mb-2">Existing Books • 3</div><div className="space-y-2">{['GUN STORY Audio','Deep Listening','Fairy Audio'].map(t=><div key={t} className="flex gap-3 p-3 rounded-[12px] bg-black border border-white/5"><div className="w-12 h-12 rounded-[6px] bg-black border border-[#D4AF37]/20 grid place-items-center"><CoinLogo size={24} /></div><div><div className="font-serif-lux text-[13px] font-bold text-[#D4AF37]">{t}</div><div className="text-[10px] text-white/40">Opening ✓ Ending ✓ • Howler.js • PLAY ONLY</div></div></div>)}</div></div></div>
            </div>
          </div>
        )}

        {tab==='ebooks' && (
          <div className="rounded-[20px] black-gold-card p-6">
            <div className="flex items-center gap-2 mb-6"><CoinLogo size={32} /><h2 className="font-serif-lux text-[22px] font-bold">Create eBook — Professional Publishing</h2></div>
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60 mb-6">Black & Gold • Front Cover JPG = First Page • SHANMUGAVEL BOOKUNIVERSE • For 5% THINKERS • Coin Logo Mandatory</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Title*</label><input placeholder="GUN STORY" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Author: Shanmugavel M with + ADD AUTHOR</label><div className="mt-1 flex gap-2"><input defaultValue="Shanmugavel M" className="flex-1 h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /><button className="h-11 px-4 rounded-[12px] gold-gradient text-black font-bold text-[11px] uppercase">+ Add</button></div></div>
              
              <div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">PDF REQUIRED* — Supported: pdf, doc/docx, rtf, txt, odt, .mobi converts to PDF, front cover as first page auto</label><input type="file" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/20 text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black file:font-bold" /></div>
              
              <div><label className="text-[11px] uppercase tracking-widest text-white/60">EPUB OPTIONAL</label><input type="file" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[12px]" /><p className="text-[10px] text-white/30 mt-1">Supported: epub. If you do not have epub, ignore this field.</p></div>
              
              <div><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Front Cover Image JPG MANDATORY First Page of Ebook</label><input type="file" accept="image/jpeg,image/jpg" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37] file:text-black" /><div className="mt-2 w-20 h-28 rounded-[8px] bg-black border border-[#D4AF37]/20 grid place-items-center"><CoinLogo size={40} /></div><p className="text-[10px] text-[#D4AF37]/60 mt-1">Cover Preview • Will be merged as first page automatically • Coin Logo Mandatory</p></div>
              
              <div><label className="text-[11px] uppercase tracking-widest">MRP Rs*</label><input type="number" placeholder="299" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">Visibility</label><select className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"><option>Public</option><option>Private</option></select></div>
              
              <div><label className="text-[11px] uppercase tracking-widest">Preview Start (e.g., 1) — Sample Before Buy</label><input defaultValue="1" type="number" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">Preview End (e.g., 10) — Free Sample Pages</label><input defaultValue="10" type="number" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              
              <div><label className="text-[11px] uppercase tracking-widest">Subtitle</label><input className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">ISBN — Enter ISDN digits</label><input placeholder="ISBN" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /><a href="https://isbn.international/" target="_blank" className="text-[10px] text-[#D4AF37]">More info: https://isbn.international/</a></div>
              
              <div><label className="text-[11px] uppercase tracking-widest">Publisher</label><input defaultValue="SHANMUGAVEL BOOKUNIVERSE" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">Language — Select up to 2</label><select className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"><option>English</option><option>Tamil</option><option>English + Tamil</option></select></div>
              
              <div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest">Category — Select up to 2</label><select className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"><option>For 5% THINKERS</option><option>Mindset</option><option>Philosophy</option></select></div>
              
              <div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest">About the authors — Shanmugavel M</label><textarea rows={3} defaultValue="Shanmugavel M - Founder, For 5% THINKERS" className="mt-1 w-full p-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div className="md:col-span-2"><label className="text-[11px] uppercase tracking-widest">Book description — Fairy quote</label><textarea rows={4} defaultValue="World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy" className="mt-1 w-full p-4 rounded-[12px] bg-black border border-[#D4AF37]/20 text-[13px] italic text-[#D4AF37]" /></div>
            </div>
            
            <div className="mt-8 flex gap-3"><button className="h-11 px-6 rounded-full border border-white/10 text-[11px] uppercase">Save Draft</button><button className="h-11 px-8 rounded-full gold-gradient text-black font-bold text-[12px] uppercase flex items-center gap-2"><CoinLogo size={20} />Publish • Front Cover = First Page • Coin Logo Mandatory</button></div>
          </div>
        )}

        {tab==='audiobooks' && (
          <div className="rounded-[20px] black-gold-card p-6">
            <div className="flex items-center gap-2 mb-6"><CoinLogo size={32} /><h2 className="font-serif-lux text-[22px] font-bold">Create Audiobook — Professional Publishing</h2></div>
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60 mb-6">Black & Gold • Howler.js Protected • SHANMUGAVEL BOOKUNIVERSE • For 5% THINKERS • Coin Logo Mandatory</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="text-[11px] uppercase tracking-widest">EBook link - optional (if audiobook based on ebook)</label><select className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]"><option>None</option><option>GUN STORY</option></select></div>
              <div><label className="text-[11px] uppercase tracking-widest">Title*</label><input className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">PDF Reference - Mandatory* (Verification Only, Not For Readers)</label><input type="file" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/20 text-[12px]" /><p className="text-[10px] text-white/30">(But Not Available For Readers) - For verification only</p></div>
              <div><label className="text-[11px] uppercase tracking-widest">Sample Audio (optional)</label><input type="file" accept="audio/mp3" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[12px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">Front Cover JPG mandatory</label><input type="file" accept="image/jpeg" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px]" /></div>
              <div><label className="text-[11px] uppercase tracking-widest">MRP Rs*</label><input type="number" placeholder="349" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-white/10 text-[13px]" /></div>
            </div>

            <div className="mt-8 rounded-[16px] border-2 border-[#D4AF37]/30 p-6 bg-black/50">
              <h3 className="font-serif-lux text-[16px] font-bold flex items-center gap-2"><CoinLogo size={24} />Audio Structure — Opening • Chapters • Ending</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60 mt-1">Gold border BIG BOX • Coin Logo Mandatory</p>
              
              <div className="mt-6"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Opening Credits Mandatory Select from local machine MP3</label><input type="file" accept="audio/mp3" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px]" /></div>
              
              <div className="mt-6"><label className="text-[11px] uppercase tracking-widest">Chapter & Adding Multiple chapters options Max 15 chapters</label><p className="text-[10px] text-white/40">Show 3 chapter rows initially each with Chapter Title input + MP3 Select + Delete, Display as 01,02,03...</p>
                <div className="mt-3 space-y-3">
                  {[1,2,3].map(i=>(
                    <div key={i} className="flex gap-2 items-center p-3 rounded-[12px] bg-[#0A0A0A] border border-white/10">
                      <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] grid place-items-center">{String(i).padStart(2,'0')}</span>
                      <input placeholder={`Chapter ${i} Title`} className="flex-1 h-10 px-3 rounded-[8px] bg-black border border-white/10 text-[12px]" />
                      <input type="file" accept="audio/mp3" className="w-[160px] h-10 px-2 rounded-[8px] bg-black border border-white/10 text-[10px]" />
                      <button className="w-8 h-8 rounded-full border border-white/10 grid place-items-center">×</button>
                    </div>
                  ))}
                </div>
                <button className="mt-3 h-9 px-4 rounded-full border border-[#D4AF37]/30 text-[11px] uppercase">+ Add Chapter • Max 15</button>
              </div>
              
              <div className="mt-6"><label className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Ending Credits Mandatory Select MP3</label><input type="file" accept="audio/mp3" className="mt-1 w-full h-11 px-4 rounded-[12px] bg-black border border-[#D4AF37]/30 text-[12px]" /></div>
              
              <p className="mt-6 text-[10px] uppercase tracking-widest text-[#D4AF37]/60">Howler.js protected • PLAY ONLY no download • Sample Audio optional for Sample Before Buy • Full After Purchase • Coin logo mandatory</p>
            </div>

            <div className="mt-8 flex gap-3"><button className="h-11 px-6 rounded-full border border-white/10 text-[11px] uppercase">Save Draft</button><button className="h-11 px-8 rounded-full gold-gradient text-black font-bold text-[12px] uppercase flex items-center gap-2"><CoinLogo size={20} />Publish Audiobook • Howler.js Protected</button></div>
          </div>
        )}

        {tab==='dashboard' && (
          <div className="grid md:grid-cols-2 gap-6"><div className="rounded-[20px] black-gold-card p-6 text-center"><CoinLogo size={40} className="mx-auto mb-2" /><div className="text-[11px] uppercase tracking-widest text-[#D4AF37]/60">Total Ebooks</div><div className="text-[32px] font-bold">4</div><div className="text-[11px] text-white/30">PDF + EPUB catalog • Cover = First Page</div></div><div className="rounded-[20px] black-gold-card p-6 text-center"><CoinLogo size={40} className="mx-auto mb-2" /><div className="text-[11px] uppercase tracking-widest text-[#D4AF37]/60">Total Audiobooks</div><div className="text-[32px] font-bold">3</div><div className="text-[11px] text-white/30">Howler.js Protected • PLAY ONLY</div></div></div>
        )}

        {tab==='founder' && (
          <div className="rounded-[20px] black-gold-card p-6"><div className="flex items-center gap-2 mb-4"><CoinLogo size={32} /><h2 className="font-serif-lux text-[20px] font-bold">Founder Vault — Shanmugavel M • 3-Step Auth</h2></div><p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60">Live — reflects instantly on About Founder page • Coin logo mandatory • For 5% THINKERS</p><div className="mt-6"><label className="text-[11px] uppercase tracking-widest">Fairy Quote • Gold Italic</label><textarea defaultValue="World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy" className="mt-1 w-full p-4 rounded-[12px] bg-black border border-[#D4AF37]/20 text-[13px] italic text-[#D4AF37]" rows={3} /></div><div className="mt-4 flex gap-2 items-center"><CoinLogo size={60} /><button className="h-10 px-4 rounded-full border border-[#D4AF37]/30 text-[11px] uppercase">Upload Coin Logo • Mandatory</button></div></div>
        )}
      </div>
    </div>
  )
}
