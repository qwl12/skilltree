/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.build.json'
  }
}
module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
