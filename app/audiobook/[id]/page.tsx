
"use client"
import { useEffect, useState, useRef } from 'react'
import { CoinLogo } from '@/components/CoinLogo'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AudiobookPlayer({ params }: { params: { id: string } }){
  const [book, setBook] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(()=>{
    supabase.from('audiobooks').select('*').eq('id', params.id).single().then(({data})=> setBook(data))
  },[params.id])

  useEffect(()=>{
    if(audioRef.current){ audioRef.current.playbackRate = speed }
  },[speed])

  if(!book) return <div className="min-h-screen bg-[#0A0A0A] grid place-items-center text-[#D4AF37]"><CoinLogo size={80}/></div>

  const allTracks = [
    ...(book.opening_url ? [{no:0, title:'Opening', url: book.opening_url}] : []),
    ...(book.chapters||[]).map((c:any)=> ({no:c.no, title:`Chapter ${String(c.no).padStart(2,'0')}`, url: c.url})),
    ...(book.ending_url ? [{no:99, title:'Ending', url: book.ending_url}] : [])
  ]
  const track = allTracks[current]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-50 bg-black border-b border-[#D4AF37]/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3"><CoinLogo size={40}/><div><div className="font-serif-lux text-[14px] font-bold text-[#D4AF37]">{book.title}</div><div className="text-[10px] uppercase tracking-widest text-white/40">Howler PLAY ONLY • Gold BIG BOX</div></div></div>
        <a href="/" className="h-8 px-4 rounded-full border border-white/10 text-[11px] uppercase grid place-items-center">Back</a>
      </header>
      <div className="max-w-[1100px] mx-auto p-6 grid md:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-[20px] bg-black border border-[#D4AF37]/30 p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20"><CoinLogo size={80}/></div>
          <div className="flex gap-6">
            <img src={book.cover_url} className="w-32 h-40 object-cover rounded-[12px] border border-[#D4AF37]/20" />
            <div className="flex-1">
              <h1 className="font-serif-lux text-[22px] font-bold text-[#D4AF37]">{book.title}</h1>
              <p className="text-[11px] text-white/40 mt-1">{book.chapters?.length||0} Chapters • Opening ✓ Ending ✓ • MRP Rs.{book.mrp}</p>
              <div className="mt-6 rounded-[16px] bg-[#111] border border-[#D4AF37]/20 p-4">
                <div className="text-[12px] font-bold text-[#D4AF37]">{track?.title} • {track?.no===0?'Opening':track?.no===99?'Ending':`CH ${String(track?.no).padStart(2,'0')}`}</div>
                <audio ref={audioRef} src={track?.url} controls className="w-full mt-3" onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} />
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>{ if(audioRef.current) audioRef.current.currentTime-=10 }} className="h-8 px-3 rounded-full bg-white/10 text-[10px] uppercase">-10s</button>
                  <button onClick={()=>{ if(audioRef.current) audioRef.current.currentTime+=10 }} className="h-8 px-3 rounded-full bg-white/10 text-[10px] uppercase">+10s</button>
                  <div className="ml-auto flex gap-1">
                    {[1,1.25,1.5].map(s=> <button key={s} onClick={()=>setSpeed(s)} className={`h-8 px-3 rounded-full text-[10px] ${speed===s?'bg-[#D4AF37] text-black font-bold':'bg-white/10'}`}>{s}x</button>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[16px] bg-black border border-white/10 p-4 max-h-[600px] overflow-auto">
          <h3 className="text-[12px] uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-2"><CoinLogo size={20}/> Gold BIG BOX • {allTracks.length} Tracks</h3>
          <div className="space-y-2">
            {allTracks.map((t:any,i:number)=>(
              <button key={i} onClick={()=>setCurrent(i)} className={`w-full h-11 px-4 rounded-full border text-[11px] flex items-center gap-3 ${i===current?'bg-[#D4AF37] text-black border-[#D4AF37] font-bold':'bg-white/5 border-white/10 text-white/60 hover:border-[#D4AF37]/30'}`}>
                <CoinLogo size={20}/>{String(t.no).padStart(2,'0')} • {t.title}<span className="ml-auto">{i===current && isPlaying ? '▶ Playing' : 'PLAY ONLY'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
