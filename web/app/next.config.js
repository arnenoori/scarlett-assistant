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
      // This redirection has been removed to keep the homepage at '/'
      //   permanent: false,
      //   source: '/',
      //   destination: '/websites',
      // },
      // Have integrations as the default websites page
    ]
  },
}