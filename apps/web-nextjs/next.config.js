/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

