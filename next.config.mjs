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
    workerThreads: true,
  },
};

export default nextConfig;
