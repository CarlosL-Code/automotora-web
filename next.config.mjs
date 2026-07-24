/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  eslint: {
    // Apaga el chequeo de código durante la compilación para ahorrar mucha RAM en Hostinger
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Activa el modo 'standalone' para reducir al mínimo el consumo de memoria del servidor en vivo
  output: 'standalone',
};
export default nextConfig;
