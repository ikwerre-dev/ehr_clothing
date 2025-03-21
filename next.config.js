/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'swissindextrade.pro'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/upload_site_backend/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'swissindextrade.pro',
        port: '',
        pathname: '/upload_system/uploads/**',
      },
    ],
  }
}

module.exports = nextConfig