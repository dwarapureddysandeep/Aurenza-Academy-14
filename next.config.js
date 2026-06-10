/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/why-us',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/why-us',
        permanent: true,
      },
      {
        source: '/roadmaps',
        destination: '/why-us',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
