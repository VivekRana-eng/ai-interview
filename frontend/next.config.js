/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable output file tracing to prevent ENOENT errors on OneDrive-synced folders
  outputFileTracing: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
