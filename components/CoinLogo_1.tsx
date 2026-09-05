import Image from 'next/image'

export function CoinLogo({ size = 48, className = '', glow = true }: { size?: number, className?: string, glow?: boolean }) {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-[#D4AF37] ${glow ? 'coin-glow' : ''} ${className}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="SHANMUGAVEL M Coin Logo Mandatory" width={size} height={size} className="w-full h-full object-cover" />
    </div>
  )
}

export function LogoWatermark() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="watermark" className="w-[300px] h-[300px] object-contain" />
    </div>
  )
}
