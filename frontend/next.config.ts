import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
