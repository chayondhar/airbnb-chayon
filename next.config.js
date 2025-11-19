const path = require('path');
const fs = require('fs');

// Patch fs.readdirSync to prevent access to restricted directories on Windows
if (process.platform === 'win32') {
  const projectRoot = path.resolve(__dirname);
  const originalReaddirSync = fs.readdirSync;
  
  fs.readdirSync = function(filePath, options) {
    try {
      const resolved = path.resolve(filePath);
      
      // Block access to Application Data and other restricted directories
      if (resolved.includes('Application Data') || 
          resolved.includes('AppData\\Local\\Application Data') ||
          (!resolved.startsWith(projectRoot) && !resolved.includes('node_modules'))) {
        return [];
      }
      
      return originalReaddirSync.call(this, filePath, options);
    } catch (error) {
      // If it's a permission error for Application Data, return empty array
      if (error.code === 'EPERM' && error.path && error.path.includes('Application Data')) {
        return [];
      }
      throw error;
    }
  };
  
  // Also patch the async version
  const originalReaddir = fs.readdir;
  fs.readdir = function(filePath, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    
    try {
      // Convert Buffer to string if needed
      const pathString = Buffer.isBuffer(filePath) ? filePath.toString() : filePath;
      const resolved = path.resolve(pathString);
      
      // Block access to Application Data and other restricted directories
      if (resolved.includes('Application Data') || 
          resolved.includes('AppData\\Local\\Application Data') ||
          (!resolved.startsWith(projectRoot) && !resolved.includes('node_modules'))) {
        return callback(null, []);
      }
      
      return originalReaddir.call(this, filePath, options, callback);
    } catch (error) {
      // If it's a permission error for Application Data, return empty array
      if (error.code === 'EPERM' && error.path && error.path.includes('Application Data')) {
        return callback(null, []);
      }
      return callback(error);
    }
  };
}

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
  // Exclude problematic directories from file tracing
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '**/Application Data/**',
        '**/AppData/**',
        '**/Local Settings/**',
        '**/Cookies/**',
        '**/NetHood/**',
        '**/PrintHood/**',
        '**/Recent/**',
        '**/SendTo/**',
        '**/Start Menu/**',
        '**/Templates/**',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    // Use polling for file watching on Windows to avoid permission issues
    if (process.platform === 'win32') {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
        ],
      };
    } else {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
        ],
      };
    }

    return config;
  },
};

module.exports = nextConfig;
