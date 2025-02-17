import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        'https://fantastic-dollop-jjjxqvqxg7p42jqp5-3000.app.github.dev/'
      ]
    }
  },
};

export default nextConfig;
