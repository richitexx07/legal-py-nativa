import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Asegurar que no se cacheen assets en producción incorrectamente
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configuración para producción
  poweredByHeader: false,
  // Evitar problemas con viewport en producción
  experimental: {
    optimizeCss: true,
  },
  // Forzar regeneración de páginas en producción
  output: 'standalone',
  // Headers para evitar caché agresivo
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
