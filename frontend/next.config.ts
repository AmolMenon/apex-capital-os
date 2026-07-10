import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/decisions',
        destination: '/deals',
        permanent: false,
      },
      {
        source: '/new',
        destination: '/deals/new',
        permanent: false,
      },
      {
        source: '/decisions/:path*',
        destination: '/deals/:path*',
        permanent: false,
      }
    ];
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  }
};

export default nextConfig;
