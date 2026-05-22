/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nexofarma.cl",
      },
    ],
  },
};

export default nextConfig;
