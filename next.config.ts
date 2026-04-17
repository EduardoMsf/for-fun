import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.240.1'],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
