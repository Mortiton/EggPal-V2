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

      // Optimize images using next/image (if using next/image, otherwise remove this block)
      // config.module.rules.push({
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   type: 'asset/resource',
      // });
    }

    // Alias for cleaner imports
    config.resolve.alias['@components'] = path.join(__dirname, 'src/app/components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/app/styles');

    return config;
  },
};
