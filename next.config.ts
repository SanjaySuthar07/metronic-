/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.1.14:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;