import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/resources',
        destination: '/content',
        permanent: true,
      },
      {
        source: '/resources/articles/:slug',
        destination: '/content/articles/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
