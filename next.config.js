const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.watchOptions = {
      ignored: [
        "**/node_modules/**",
        "../**", // ignore parent dirs (glob, not absolute path)
      ],
    };
  }
  return config;
},
};

module.exports = nextConfig;
