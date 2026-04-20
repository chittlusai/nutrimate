/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [],
  },

  async rewrites() {
    // Rewrites only work in development (next dev)
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
      {
        source: "/detect-food",
        destination: "http://localhost:5000/detect-food",
      },
      {
        source: "/manual-food",
        destination: "http://localhost:5000/manual-food",
      },
      {
        source: "/health-check",
        destination: "http://localhost:5000/health-check",
      },
    ];
  },
};

module.exports = nextConfig;
