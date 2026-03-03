// next.config.js
if (typeof File === 'undefined') {
  global.File = class File {};
}
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

// Corrected URL logic for Railway
const NEXT_PUBLIC_SERVER_URL = 
  process.env.NEXT_PUBLIC_SERVER_URL || 
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        try {
          const url = new URL(item)
          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        } catch (e) {
          // Fallback to the production hostname if URL parsing fails
          return {
            hostname: 'netnetworklead-production.up.railway.app',
            protocol: 'https',
          }
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  devIndicators: false,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
