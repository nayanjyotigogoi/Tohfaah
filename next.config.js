/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      // Allow any hostname for production API URLs
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images for development (fallback)
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
