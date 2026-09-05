
"use client"
import { CoinLogo } from '@/components/CoinLogo'
export default function Cart(){
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 text-center">
      <CoinLogo size={80} className="mx-auto" />
      <h1 className="font-serif-lux text-[24px] font-bold mt-4">Cart • P8 Pending</h1>
      <p className="text-[12px] text-white/40 mt-2">Razorpay integration P13 • UPI success@razorpay • Card 4111 1111 1111 1111</p>
      <a href="/" className="mt-6 inline-flex h-10 px-6 rounded-full bg-[#D4AF37] text-black font-bold text-[12px] uppercase items-center">Back to Home • P0 Frame DONE</a>
    </div>
  )
}
