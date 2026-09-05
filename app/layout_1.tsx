import './globals.css'
export const metadata = {
  title: 'SHANMUGAVEL BOOKUNIVERSE - For 5% THINKERS',
  description: 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy - Founder Shanmugavel M - READ/PLAY ONLY No Download'
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
