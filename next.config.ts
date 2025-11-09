import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
  webpack: (config) => {
    // Ignore problematic Windows folders
    config.watchOptions = {
      ignored: [
        "**/node_modules/**",
        "**/Application Data/**",
        "**/AppData/**",
        "**/Local Settings/**",
      ],
    };
    return config;
  },
};

export default nextConfig;
