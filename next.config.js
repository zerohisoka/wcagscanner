/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle puppeteer on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        puppeteer: false,
        'chrome-aws-lambda': false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'axe-core', 'chrome-aws-lambda', '@react-pdf/renderer'],
  },
};

module.exports = nextConfig;
