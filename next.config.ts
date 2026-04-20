import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.240.1'],
  outputFileTracingIncludes: {
    '/**': ['./src/generated/prisma/**/*'],
  },
};

export default nextConfig;
