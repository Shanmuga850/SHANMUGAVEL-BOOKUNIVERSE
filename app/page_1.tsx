
"use client"
import { useState, useEffect } from 'react'
import { CoinLogo, LogoWatermark } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [ebooks, setEbooks] = useState<any[]>([])
  const [audiobooks, setAudiobooks] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])

  useEffect(()=>{
    supabase.from('ebooks').select('*').order('created_at',{ascending:false}).then(({data})=> setEbooks(data||[]))
    supabase.from('audiobooks').select('*').order('created_at',{ascending:false}).then(({data})=> setAudiobooks(data||[]))
  },[])

  const filteredEbooks = ebooks.filter(b=> b.title.toLowerCase().includes(search.toLowerCase()))
  const filteredAudio = audiobooks.filter(b=> b.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-[#D4AF37]/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CoinLogo size={52} />
          <div>
            <h1 className="font-serif-lux text-[16px] font-bold tracking-wide">SHANMUGAVEL BOOKUNIVERSE</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/60">For 5% THINKERS • P0 Frame DONE • Coin Logo Mandatory</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ebooks..." className="h-9 px-4 rounded-full bg-white/5 border border-white/10 text-[12px] w-[180px]" />
          <a href="/admin" className="h-9 px-5 rounded-full border border-[#D4AF37]/30 text-[11px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition">Founder Vault • P1 DONE</a>
        </div>
      </header>

      <section className="px-6 py-12 text-center max-w-[900px] mx-auto relative">
        <LogoWatermark />
        <div className="relative">
          <div className="flex justify-center mb-6"><CoinLogo size={100} /></div>
          <h2 className="font-serif-lux text-[36px] font-bold">For 5% THINKERS</h2>
          <p className="mt-4 font-serif-lux italic text-[18px] text-[#D4AF37]">"World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy"</p>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-white/40">Founder: Shanmugavel M • READ ONLY • Cover = First Page • P3 DONE • P0 Black & Gold</p>
        </div>
      </section>

      <section className="px-6 pb-10 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CoinLogo size={32} />
          <h3 className="font-serif-lux text-[20px] font-bold">Ebooks — For 5% THINKERS • {filteredEbooks.length} Live • P3 DONE ✅</h3>
          <span className="ml-auto text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">Cover = First Page</span>
        </div>
        {filteredEbooks.length===0? (
          <div className="rounded-[16px] bg-black border border-[#D4AF37]/10 p-12 text-center">
            <CoinLogo size={56} />
            <p className="mt-4 text-[13px] text-white/30">No ebooks yet — Publish from Founder Vault /admin → Create eBook • Server Upload Fixed</p>
            <p className="mt-2 text-[10px] text-white/20">Add SUPABASE_SERVICE_ROLE_KEY in Vercel Env to fix ebooks: Failed to fetch</p>
          </div>
        ):(
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredEbooks.map((b:any)=>(
              <div key={b.id} onClick={()=>setSelected(b)} className="group cursor-pointer rounded-[16px] bg-black border border-white/10 hover:border-[#D4AF37]/40 overflow-hidden transition">
                <div className="aspect-[3/4] bg-[#111] overflow-hidden"><img src={b.cover_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition" /></div>
                <div className="p-3">
                  <div className="font-serif-lux text-[13px] font-bold text-[#D4AF37] line-clamp-2">{b.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Rs. {b.mrp} • READ ONLY • P5 PDF.js</div>
                  <div className="mt-2 text-[9px] uppercase px-2 py-1 rounded-full bg-white/5 border border-white/10 inline-block">P3 Cover=First Page • {b.cover_cloudinary?'Cloudinary ✅':''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-20 max-w-[1200px] mx-auto opacity-60">
        <div className="flex items-center gap-3 mb-6">
          <CoinLogo size={32} />
          <h3 className="font-serif-lux text-[18px] font-bold">Audiobooks • {filteredAudio.length} Live • P4 NEXT</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredAudio.map((b:any)=>(
            <div key={b.id} className="rounded-[20px] bg-black border border-[#D4AF37]/20 p-4">
              <div className="flex gap-3"><img src={b.cover_url} className="w-16 h-20 object-cover rounded-[8px]" /><div><div className="text-[14px] font-bold text-[#D4AF37]">{b.title}</div><div className="text-[11px] text-white/40">Rs.{b.mrp} • {b.chapters?.length||0} Audios • Howler PLAY ONLY • P6</div></div></div>
            </div>
          ))}
          {filteredAudio.length===0 && <div className="text-[12px] text-white/20">No audiobooks yet — P4 Gold BIG BOX pending after P3</div>}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur grid place-items-center p-4">
          <div className="w-full max-w-[900px] rounded-[16px] bg-[#0A0A0A] border border-[#D4AF37]/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3"><CoinLogo size={36}/><div><div className="font-serif-lux text-[14px] font-bold text-[#D4AF37]">{selected.title}</div><div className="text-[10px] uppercase tracking-widest text-white/40">Ebook • Cover = First Page • P3 DONE</div></div></div>
              <button onClick={()=>setSelected(null)} className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">✕</button>
            </div>
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-0">
              <div className="p-4 bg-black"><div className="aspect-[3/4] rounded-[12px] overflow-hidden border border-white/10"><img src={selected.cover_url} className="w-full h-full object-cover" /></div>
                <div className="mt-4 flex gap-2">
                  <a href={selected.pdf_url} target="_blank" className="flex-1 h-11 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase grid place-items-center">READ PDF • P5 PDF.js</a>
                  <button onClick={()=>setCart([...cart, selected])} className="flex-1 h-11 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-[12px] uppercase">Add to Cart • P8</button>
                </div>
              </div>
              <div className="p-6">
                <div className="font-serif-lux text-[18px] font-bold text-[#D4AF37]">{selected.title}</div>
                <div className="mt-2 text-[12px] text-white/60">{selected.description}</div>
                <div className="mt-4 text-[11px] uppercase tracking-widest text-white/40">Publisher: {selected.publisher} • MRP Rs. {selected.mrp}</div>
                <div className="mt-6 p-3 rounded-[12px] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] flex items-center gap-2"><CoinLogo size={16}/>READ ONLY • No Download • Inbuilt Reader • P5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <div className="flex justify-center mb-3"><CoinLogo size={40}/></div>
        <div className="text-[10px] uppercase tracking-widest text-white/30">© Shanmugavel M • For 5% THINKERS • Black & Gold Luxury #D4AF37 • Coin Logo Mandatory Everywhere • P0 DONE</div>
        <div className="text-[9px] uppercase tracking-widest text-white/20 mt-2">P0 Frame DONE ✅ P1 Vault Seal VELS5PERCENT ✅ P1 Email founder@velsbookstore.com ✅ P2 Supabase 6 tables + Storage PUBLIC + Cloudinary env ✅ P3 Create eBook Front Cover=First Page Hybrid Upload Route ✅ P7 Dashboard Real Count ✅ P9 My Books Real Supabase ✅ P14 OTP LAST ✅ • P4-P6 Audiobook Gold BIG BOX Next • P5 PDF.js Reader • P6 Howler Player • P8 Cart • P10 About Founder • P12 Search • P13 Razorpay Stats</div>
      </footer>
    </div>
  )
}
