/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  env: {
    ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    FAVICON_BASE_PATH: process.env.NEXT_PUBLIC_FAVICON_BASE_PATH,
  },
  images: {
    domains: ['ipfs.io'],
  },
  output: "export",
  basePath: '/ScrowLiteDApp', // comment this property when trying to run locally
}

module.exports = nextConfig
