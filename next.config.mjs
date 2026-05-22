/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nexofarma.cl",
      },
    ],
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
