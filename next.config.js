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
  },
  webpack: (config, { isServer }) => {
    // Add transpilation for undici
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-private-methods', '@babel/plugin-transform-class-properties']
        }
      }
    });
    return config;
  }
}

module.exports = nextConfig 