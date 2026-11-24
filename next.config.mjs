/** @type {import('next').NextConfig} */
const nextConfig = {
  // Los encabezados de seguridad se agregan en src/middleware.ts
  // (así aplican a todas las respuestas, incluidas las de la API).
  poweredByHeader: false,
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
    // workerThreads no es compatible con Next 15 (DataCloneError al generar páginas)
    workerThreads: false,
  },
};

export default nextConfig;
