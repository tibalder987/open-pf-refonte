import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'open.pf',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

export default nextConfig
