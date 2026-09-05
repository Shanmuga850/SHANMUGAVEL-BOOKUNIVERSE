
"use client"
import { useEffect, useState } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export default function MyBooks(){
  const [ebooks,setEbooks]=useState<any[]>([])
  useEffect(()=>{ supabase.from('ebooks').select('*').order('created_at',{ascending:false}).then(({data})=> setEbooks(data||[])) },[])
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="px-6 py-4 border-b border-white/10 flex items-center gap-3"><CoinLogo size={40}/><h1 className="font-serif-lux text-[18px] font-bold">My Books • P9 DONE • Real Supabase {ebooks.length}</h1><a href="/" className="ml-auto h-9 px-4 rounded-full border border-white/10 text-[11px] uppercase grid place-items-center">Home</a></header>
      <div className="p-6 grid md:grid-cols-4 gap-4 max-w-[1200px] mx-auto">{ebooks.map((b:any)=><div key={b.id} className="rounded-[16px] bg-black border border-[#D4AF37]/20 p-3"><img src={b.cover_url} className="w-full aspect-[3/4] object-cover rounded-[12px]" /><div className="mt-3 text-[13px] font-bold text-[#D4AF37]">{b.title}</div><div className="text-[11px] text-white/40">Rs.{b.mrp} • READ ONLY • PDF.js</div></div>)}</div>
    </div>
  )
}
