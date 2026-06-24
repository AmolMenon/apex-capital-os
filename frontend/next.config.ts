import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/deal/:id/:path*',
        destination: '/deals/:id/:path*',
        permanent: true,
      },
      {
        source: '/deal/:id',
        destination: '/deals/:id',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
