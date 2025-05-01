import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
