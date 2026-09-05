
import { CoinLogo } from '@/components/CoinLogo'
export default function About(){
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="px-6 py-4 border-b border-[#D4AF37]/20 flex items-center gap-3"><CoinLogo size={48}/><h1 className="font-serif-lux text-[18px] font-bold">About Founder • P10 DONE</h1><a href="/" className="ml-auto h-9 px-4 rounded-full border border-white/10 text-[11px] uppercase grid place-items-center">Home</a></header>
      <div className="max-w-[800px] mx-auto p-8 text-center">
        <CoinLogo size={120} /><h2 className="font-serif-lux text-[32px] font-bold text-[#D4AF37] mt-6">Shanmugavel M</h2><p className="text-[12px] uppercase tracking-widest text-white/40 mt-2">Founder • For 5% THINKERS • SHANMUGAVEL BOOKUNIVERSE</p>
        <p className="mt-8 font-serif-lux italic text-[18px] text-[#D4AF37]">"World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy"</p>
        <p className="mt-6 text-[13px] leading-relaxed text-white/60">I build for the 5% who think differently. Every ebook cover is its first page, minted not printed. READ ONLY, PLAY ONLY, no download — protected by PDF.js and Howler.js. Black & Gold luxury is not a theme, it is a standard. Coin Logo mandatory everywhere.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
          <div className="rounded-[16px] bg-black border border-[#D4AF37]/20 p-4"><div className="text-[11px] uppercase tracking-widest text-[#D4AF37]">Philosophy</div><div className="text-[12px] mt-2 text-white/60">Sample Before Buy free vs Full After Purchase • No piracy, only fairies guide you</div></div>
          <div className="rounded-[16px] bg-black border border-white/10 p-4"><div className="text-[11px] uppercase tracking-widest text-white/40">Brand</div><div className="text-[12px] mt-2 text-white/60">Coin Logo with blue whale on gold luxury • Mandatory on every screen</div></div>
          <div className="rounded-[16px] bg-black border border-white/10 p-4"><div className="text-[11px] uppercase tracking-widest text-white/40">Mission</div><div className="text-[12px] mt-2 text-white/60">For 5% Thinkers manual • Gun Story series • Life With Blessings and Curses</div></div>
        </div>
      </div>
    </div>
  )
}
