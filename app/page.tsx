"use client"
import { useState } from 'react'
import { CoinLogo, LogoWatermark } from '@/components/CoinLogo'

const MOCK_EBOOKS = [
  { id: '1', title: 'GUN STORY - For 5% THINKERS', authors: ['Shanmugavel M'], mrp: 299, cover: '/logo.png', category: 'Mindset', sku: 'GUN-STORY-001' },
  { id: '2', title: 'Fairy Guides Fantasy', authors: ['Shanmugavel M'], mrp: 199, cover: '/logo.png', category: 'Philosophy', sku: 'FAIRY-002' },
  { id: '3', title: 'Whale Wisdom', authors: ['Shanmugavel M'], mrp: 249, cover: '/logo.png', category: 'Deep Thinking', sku: 'WHALE-003' },
  { id: '4', title: '5% Thinkers Manual', authors: ['Shanmugavel M'], mrp: 399, cover: '/logo.png', category: 'Leadership', sku: '5PCT-004' },
]
const MOCK_AUDIOBOOKS = [
  { id: 'a1', title: 'GUN STORY Audio', author: 'Shanmugavel M', narrator: 'Shanmugavel M', mrp: 349, cover: '/logo.png', chapters: 12 },
  { id: 'a2', title: 'Deep Listening', author: 'Shanmugavel M', narrator: 'Shanmugavel M', mrp: 299, cover: '/logo.png', chapters: 8 },
  { id: 'a3', title: 'Fairy Audio Guide', author: 'Shanmugavel M', narrator: 'Shanmugavel M', mrp: 199, cover: '/logo.png', chapters: 15 },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [view, setView] = useState<'home' | 'ebook' | 'audiobook' | 'cart' | 'mybooks' | 'about'>('home')
  const [selected, setSelected] = useState<any>(null)

  const filteredEbooks = MOCK_EBOOKS.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
  const filteredAudio = MOCK_AUDIOBOOKS.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header with Logo Mandatory Everywhere */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CoinLogo size={48} />
          <div>
            <h1 className="font-serif-lux text- font-bold tracking-tight leading-none">SHANMUGAVEL BOOKUNIVERSE</h1>
            <p className="text- tracking-[0.2em] uppercase text-[#D4AF37]/70">For 5% THINKERS • Coin Logo Mandatory</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search For 5% THINKERS..." className="h-9 px-4 rounded-full bg-white/5 border border-white/10 text- w-" />
          <button onClick={()=>setView('about')} className="h-9 px-4 rounded-full border border-white/10 text- uppercase">About Founder</button>
          <button onClick={()=>setView('cart')} className="h-9 px-4 rounded-full border border-[#D4AF37]/30 text- uppercase flex items-center gap-2">Cart • {cart.length} <CoinLogo size={20} /></button>
          <a href="/admin" className="h-9 px-4 rounded-full gold-gradient text-black font-bold text- uppercase">Founder Vault</a>
        </div>
      </header>

      {view === 'home' && (
        <>
          {/* Hero with Large Logo Center */}
          <section className="py-12 text-center relative overflow-hidden">
            <LogoWatermark />
            <div className="relative">
              <div className="flex justify-center mb-6"><CoinLogo size={120} /></div>
              <h2 className="font-serif-lux text- font-bold">For 5% THINKERS</h2>
              <p className="text- italic text-[#D4AF37] mt-3 max-w- mx-auto">"World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy"</p>
              <p className="text- uppercase tracking-widest text-white/50 mt-2">Founder: Shanmugavel M • READ/PLAY ONLY No Download • Front Cover JPG = First Page</p>
            </div>
          </section>

          {/* Ebooks */}
          <section className="px-8 py-8">
            <h3 className="font-serif-lux text- font-bold flex items-center gap-3"><CoinLogo size={32} />Ebooks — For 5% THINKERS <span className="text- uppercase tracking-widest text-[#D4AF37]/60">Cover = First Page • Sample Before Buy</span></h3>
            <div className="grid grid-cols-4 gap-6 mt-6">
              {filteredEbooks.map(b=>(
                <div key={b.id} onClick={()=>{setSelected(b); setView('ebook')}} className="rounded- black-gold-card p-3 cursor-pointer hover:border-[#D4AF37]/40 transition group relative overflow-hidden">
                  <div className="absolute top-2 right-2"><CoinLogo size={24} /></div>
                  <div className="w-full h- rounded- bg-[#0A0A0A] border border-[#D4AF37]/20 overflow-hidden flex items-center justify-center"><img src={b.cover} alt="" className="w-full h-full object-cover opacity-80" /></div>
                  <div className="mt-3"><div className="font-serif-lux text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/50">{b.authors.join(', ')} • Rs.{b.mrp} • {b.sku}</div><div className="mt-2 h-6 px-2 rounded-full border border-white/10 text- uppercase inline-flex items-center">Cover = 1st Page • READ ONLY • Shanmugavel M</div></div>
                </div>
              ))}
            </div>
          </section>

          {/* Audiobooks */}
          <section className="px-8 py-8">
            <h3 className="font-serif-lux text- font-bold flex items-center gap-3"><CoinLogo size={32} />Audiobooks — Deep Listening <span className="text- uppercase tracking-widest text-[#D4AF37]/60">Howler.js Protected • Sample Audio</span></h3>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {filteredAudio.map(b=>(
                <div key={b.id} onClick={()=>{setSelected(b); setView('audiobook')}} className="rounded- black-gold-card p-4 cursor-pointer hover:border-[#D4AF37]/40 relative">
                  <div className="absolute top-2 right-2"><CoinLogo size={24} /></div>
                  <div className="flex gap-4"><div className="w-20 h-20 rounded- bg-black border border-[#D4AF37]/20 overflow-hidden"><img src={b.cover} alt="" className="w-full h-full object-cover" /></div><div><div className="font-serif-lux text- font-bold text-[#D4AF37]">{b.title}</div><div className="text- text-white/50">{b.author} • Narrator {b.narrator}</div><div className="text- uppercase text-white/30 mt-1">{b.chapters} chapters • Opening ✓ Ending ✓ • Howler.js • PLAY ONLY</div></div></div>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-white/10 py-8 text-center"><div className="flex justify-center mb-3"><CoinLogo size={56} /></div><div className="text- uppercase tracking-widest text-[#D4AF37]">SHANMUGAVEL BOOKUNIVERSE • For 5% THINKERS • Shanmugavel M • Coin Logo Mandatory</div><div className="text- text-white/30 mt-1">READ/PLAY ONLY No Download • PDF.js + Howler.js Protected • Front Cover JPG = First Page</div></footer>
        </>
      )}

      {view === 'ebook' && selected && (
        <div className="p-8 max-w- mx-auto">
          <button onClick={()=>setView('home')} className="h-9 px-4 rounded-full border border-white/10 text- uppercase mb-6">← Back to Home</button>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded- black-gold-card p-6 relative min-h-"><LogoWatermark /><div className="relative"><div className="flex items-center gap-2 mb-4"><CoinLogo size={32} /><span className="text- uppercase tracking-widest text-[#D4AF37]">Ebook • Cover = First Page • SHANMUGAVEL BOOKUNIVERSE</span></div><div className="w-full h- bg-black border border-[#D4AF37]/20 rounded- grid place-items-center text- text-white/30">PDF.js Protected Viewer<br/>Sample Pages {1}-{10} Free<br/>Full After Purchase READ ONLY<br/>No Download<br/><CoinLogo size={80} className="mt-4" /></div></div></div>
            <div><h1 className="font-serif-lux text- font-bold text-[#D4AF37]">{selected.title}</h1><p className="text-white/60 text- mt-2">{selected.authors?.join(', ')} • Rs.{selected.mrp} • {selected.sku}</p><div className="mt-6 flex gap-2"><button onClick={()=>setCart([...cart, selected])} className="h-11 px-6 rounded-full gold-gradient text-black font-bold text- uppercase">Add to Cart • READ ONLY</button><button className="h-11 px-6 rounded-full border border-white/10 text- uppercase">Sample Before Buy Free</button></div><div className="mt-8 text- italic text-[#D4AF37]">"World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy"</div></div>
          </div>
        </div>
      )}

      {view === 'audiobook' && selected && (
        <div className="p-8 max-w- mx-auto">
          <button onClick={()=>setView('home')} className="h-9 px-4 rounded-full border border-white/10 text- uppercase mb-6">← Back</button>
          <div className="rounded- black-gold-card p-6 relative"><LogoWatermark /><div className="relative"><div className="flex items-center gap-2"><CoinLogo size={32} /><span className="text- uppercase tracking-widest text-[#D4AF37]">Audiobook • Howler.js Protected • SHANMUGAVEL BOOKUNIVERSE</span></div><div className="mt-6 grid md:grid-cols-2 gap-6"><div className="h- bg-black rounded- border border-[#D4AF37]/20 grid place-items-center"><CoinLogo size={100} /><div className="text- uppercase text-white/30 mt-4">Howler.js Protected Player<br/>Opening • Chapters Max 15 (01,02,03) • Ending<br/>PLAY ONLY No Download</div></div><div><h2 className="font-serif-lux text- font-bold text-[#D4AF37]">{selected.title}</h2><p className="text-white/50 text-">Narrator {selected.narrator} • {selected.chapters} chapters</p><div className="mt-4 space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-4 text-">{String(i+1).padStart(2,'0')} • Chapter Title {i+1} <span className="ml-auto"><CoinLogo size={20} /></span></div>)}</div><button onClick={()=>setCart([...cart, selected])} className="mt-6 h-11 px-6 rounded-full gold-gradient text-black font-bold text- uppercase w-full">Add to Cart • PLAY ONLY</button></div></div></div></div>
        </div>
      )}

      {view === 'cart' && (
        <div className="p-8 max-w- mx-auto text-center"><CoinLogo size={80} className="mx-auto mb-4" /><h2 className="font-serif-lux text- font-bold">Cart</h2>{cart.length===0?<p className="text-white/30 text- mt-4">Cart empty • Add books to read</p>:<div className="mt-6 space-y-3">{cart.map((c,i)=><div key={i} className="flex items-center gap-3 p-3 rounded- black-gold-card"><CoinLogo size={40} /><div className="text-left"><div className="text- font-bold text-[#D4AF37]">{c.title}</div><div className="text- text-white/40">Rs.{c.mrp}</div></div></div>)}<div className="mt-6 h-12 rounded-full gold-gradient text-black font-bold grid place-items-center">Checkout via Razorpay • UPI success@razorpay</div></div>}</div>
      )}
    </div>
  )
}
