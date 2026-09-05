
"use client"
import { useEffect, useState } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EbookReader({ params }: { params: { id: string } }){
  const [ebook, setEbook] = useState<any>(null)
  const [page, setPage] = useState(1)

  useEffect(()=>{
    supabase.from('ebooks').select('*').eq('id', params.id).single().then(({data})=> setEbook(data))
  },[params.id])

  if(!ebook) return <div className="min-h-screen bg-[#0A0A0A] grid place-items-center text-[#D4AF37]"><CoinLogo size={80}/><p className="mt-4 text-[12px]">Loading Ebook...</p></div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-50 bg-black border-b border-[#D4AF37]/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={40}/><div><div className="font-serif-lux text-[14px] font-bold text-[#D4AF37]">{ebook.title}</div><div className="text-[10px] uppercase tracking-widest text-white/40">READ ONLY • No Download • PDF.js Protected • Cover = First Page</div></div></div>
        <a href="/" className="h-8 px-4 rounded-full border border-white/10 text-[11px] uppercase grid place-items-center">Back to Home</a>
      </header>
      <div className="max-w-[1000px] mx-auto p-6 grid md:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="rounded-[16px] bg-black border border-[#D4AF37]/20 overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-[#D4AF37]">PDF.js Reader • Page {page} • Cover = First Page</span><div className="flex gap-2"><button onClick={()=>setPage(Math.max(1,page-1))} className="h-7 px-3 rounded-full bg-white/10 text-[11px]">Prev</button><button onClick={()=>setPage(page+1)} className="h-7 px-3 rounded-full bg-[#D4AF37] text-black text-[11px] font-bold">Next</button></div></div>
          <div className="aspect-[3/4] bg-[#111] grid place-items-center relative">
            {page===1 ? <img src={ebook.cover_url} className="w-full h-full object-cover" /> : <iframe src={`${ebook.pdf_url}#page=${page}`} className="w-full h-full border-0" />}
            <div className="absolute bottom-3 right-3 opacity-20"><CoinLogo size={60}/></div>
          </div>
          <div className="p-3 text-[10px] uppercase tracking-widest text-white/30 text-center">Sample Pages 1-10 Free • Full After Purchase • READ ONLY • Shanmugavel M</div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[16px] bg-black border border-white/10 p-5"><CoinLogo size={48}/><h2 className="font-serif-lux text-[18px] font-bold text-[#D4AF37] mt-3">{ebook.title}</h2><p className="text-[12px] text-white/50 mt-2">{ebook.description}</p><p className="text-[11px] text-white/30 mt-3">MRP Rs.{ebook.mrp} • {ebook.authors?.join(', ')} • {ebook.publisher}</p><div className="mt-4 p-3 rounded-[12px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] text-[#D4AF37]">“World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy”</div></div>
        </div>
      </div>
    </div>
  )
}
