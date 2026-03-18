import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/resources/:path*',
        destination: '/content/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
