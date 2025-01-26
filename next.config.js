/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add any external image domains if needed
  },
  typescript: {
    // Don't fail build on TS errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't fail build on ESLint errors during deployment
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 