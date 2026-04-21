import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.240.1'],
  outputFileTracingRoot: path.join(__dirname),
  outputFileTracingIncludes: {
    '/**': [
      './src/generated/prisma/**/*',
      './node_modules/.prisma/**/*',
      './node_modules/@prisma/engines/**/*',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
