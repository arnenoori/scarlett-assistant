const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'tosbuddy.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        permanent: false,
        source: '/',
        destination: '/websites/integrations',
      },
      // Have integrations as the default websites page
      {
        permanent: false,
        source: '/websites',
        destination: '/websites/integrations',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'tailwindcss',
                'autoprefixer',
              ],
            },
          },
        },
      ],
      include: path.resolve(__dirname, 'styles'),
    });
    return config;
  },
};