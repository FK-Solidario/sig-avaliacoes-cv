/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['84.247.171.243'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://84.247.171.243:5000',
  },
}

export default nextConfig