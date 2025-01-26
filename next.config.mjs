/** @type {import('next').NextConfig} */
// Force clean deployment
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  transpilePackages: ['undici'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude undici from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
        'node-fetch': false,
        'isomorphic-fetch': false,
        fetch: false,
      };
    }
    return config;
  },
};

export default nextConfig;
