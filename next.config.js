const path = require('path');

module.exports = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  compress: true,
  swcMinify: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Feature-Policy',
            value: "geolocation 'self'; microphone 'self'; camera 'self'",
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://fnjmrcdmectyvrnoxamx.supabase.co;"
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.test\.js$/,
        include: path.resolve(__dirname, 'src/app/__tests__'), 
        loader: 'ignore-loader',
      });
    }

    config.resolve.alias['@components'] = path.join(__dirname, 'src/app/components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/app/styles');
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Disable Webpack cache in development mode
    if (dev) {
      config.cache = false;
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fnjmrcdmectyvrnoxamx.supabase.co',
        pathname: '/storage/v1/object/public/EggPal/pals/**',
      },
      {
        protocol: 'https',
        hostname: 'fnjmrcdmectyvrnoxamx.supabase.co',
        pathname: '/storage/v1/object/public/EggPal/icons/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
};
