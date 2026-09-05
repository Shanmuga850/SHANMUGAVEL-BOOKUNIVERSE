# SHANMUGAVEL BOOKUNIVERSE - For 5% THINKERS
Founder: Shanmugavel M
Brand: Coin Logo Mandatory on Every Screen, Black & Gold Luxury #D4AF37

## Philosophy
- READ/PLAY ONLY - No Download - PDF.js + Howler.js protected
- Front Cover JPG = First Page - every ebook first page is its cover, minted not printed
- Sample Before Buy free vs Full After Purchase
- Fairy Quote Gold Italic: "World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy"

## Roles
### USER (Public)
- / - Landing with 2 grids Ebooks + Audiobooks
- /ebook/[id] - PDF.js reader READ ONLY
- /audiobook/[id] - Howler.js PLAY ONLY Opening + Chapters Max 15 + Ending
- /cart, /my-books, /about

### ADMIN (Founder Vault Private)
- /admin - 3-Step Auth: Seal VELS5PERCENT -> Email founder@velsbookstore.com / founder123 -> OTP 6-digit
- /admin/mybooks - Drafts + Existing GUN STORY example
- /admin/ebooks/create - Title*, Authors+, PDF REQUIRED (doc/mobi/txt->PDF), Cover JPG MANDATORY First Page merge
- /admin/audiobooks/create - Gold BIG BOX Opening* + Chapters Max 15 + Ending*, PDF Ref Mandatory verification only
- /admin/dashboard, /admin/founder (live)

## Deploy Vercel
1. npm install
2. Copy .env.example to .env.local and fill Supabase + R2 + Razorpay
3. Run supabase/schema.sql in Supabase SQL Editor
4. Create R2 bucket + CORS
5. npm run dev -> http://localhost:3000
6. vercel --prod

## Storage
R2 10GB + B2 10GB = 20GB or Oracle Always Free 20GB
Signed URLs <10min expiry, no download endpoints

## Payment
Razorpay Test: success@razorpay / failure@razorpay, Card 4111 1111 1111 1111

## Logo Mandatory Everywhere
/public/logo.png - gold coin with SHANMUGAVEL M + blue whale
