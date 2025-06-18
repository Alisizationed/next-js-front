// next.config.js
import path from 'path';
import './src/env.js';

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone', // Required for Docker deployment
  images: {
    domains: ['localhost'],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve = {
      ...(webpackConfig.resolve || {}),
      alias: {
        ...(webpackConfig.resolve?.alias || {}),
        jotai: path.resolve(process.cwd(), 'node_modules/jotai'),
        '@': path.resolve(process.cwd(), 'src'),
      },
    };
    return webpackConfig;
  },
};

export default config;