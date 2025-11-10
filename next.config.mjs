/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'i.pravatar.cc'],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

