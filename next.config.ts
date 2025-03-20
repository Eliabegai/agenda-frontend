import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://195.35.40.120:3000/:path*'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: "standalone"
};

export default nextConfig;
