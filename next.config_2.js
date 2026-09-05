/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb'
    }
  }
}
module.exports = nextConfig
