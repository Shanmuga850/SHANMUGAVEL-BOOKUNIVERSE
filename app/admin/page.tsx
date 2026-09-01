"use client"
import { useState } from 'react'
import { CoinLogo } from '@/components/CoinLogo'

export default function Admin() {
  const [step, setStep] = useState(1)
  const [seal, setSeal] = useState('')
  const [email, setEmail] = useState('shanmugavelvetri@gmail.com')
  const [pwd, setPwd] = useState('')
  const [otp, setOtp] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('mybooks')

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] grid place-items-center p-6">
        <div className="w-full max-w- rounded- black-gold-card p-8 text-center">
          <div className="flex justify-center mb-4"><CoinLogo size={80} /></div>
          <h1 className="font-serif-lux text- font-bold">SHANMUGAVEL BOOKUNIVERSE</h1>
          <p className="text- uppercase tracking-widest text-[#D4AF37]/70">Founder Vault • Private • 3-Step Auth • Coin Logo Mandatory</p>

          {step===1 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 1: Founder Seal Password</label>
              <p className="text- text-white/40 mt-1">Hint: Try VELS5PERCENT or FOR 5% THINKERS — this is Seal Password, not email password.</p>
              <input value={seal} onChange={e=>setSeal(e.target.value)} placeholder="Enter Seal Password" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" />
              <button onClick={()=>{if(seal.toUpperCase().includes('VELS5PERCENT') || seal.toUpperCase().includes('FOR 5')) setStep(2); else alert('Invalid Seal')}} className="mt-4 w-full h-11 rounded-full gold-gradient text-black font-bold text- uppercase">Unlock Seal • Coin Logo</button>
            </div>
          )}
          {step===2 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 2: Email / Password</label>
              <p className="text- text-white/40 mt-1">Founder: shanmugavelvetri@gmail.com • For 5% THINKERS • VelShanmugam@850</p>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" />
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="VelShanmugam@850" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-white/10 text-" />
              <button onClick={()=>{
                if(email.trim()==='shanmugavelvetri@gmail.com' && pwd==='VelShanmugam@850'){
                  setStep(3)
                } else {
                  alert('Invalid - Use shanmugavelvetri@gmail.com / VelShanmugam@850')
                }
              }} className="mt-4 w-full h-11 rounded-full gold-gradient text-black font-bold text- uppercase">Next • Email Verify</button>
            </div>
          )}
          {step===3 && (
            <div className="mt-8 text-left">
              <label className="text- uppercase tracking-widest text-[#D4AF37]">Step 3: Email Verification - OTP - LAST</label>
              <p className="text- text-white/40 mt-1">OTP will be sent to shanmugavelvetri@gmail.com — 6-digit code. Currently bypass allowed for development.</p>
              <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="mt-3 w-full h-11 px-4 rounded-full bg-black border border-[#D4AF37]/20 text-" />
              <button onClick={()=>setAuthed(true
