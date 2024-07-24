const path = require('path');

module.exports = {
  // Optimize build for production
  productionBrowserSourceMaps: true,
  reactStrictMode: true,

  // Headers configuration
  async headers() {
    return [
      {
        // Define security headers
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
        ],
      },
      {
        // Define cache-control headers for images and icons
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=604800', // 30 days max-age, 7 days stale-while-revalidate
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude test files from the client bundle
      config.module.rules.push({
        test: /\.test\.js$/,
        include: path.resolve(__dirname, 'src/app/__tests__'), 
        loader: 'ignore-loader',
      });
    }

    // Alias for cleaner imports
    config.resolve.alias['@components'] = path.join(__dirname, 'src/app/components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/app/styles');

    return config;
  },

  // Image configuration
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
  },
};