/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    esmExternals: false
  },

  images: {
    // PENTING: Disable image optimization untuk server Linux yang tidak support /_next/image
    unoptimized: true,

    // Gunakan host yang kamu butuhkan aja
    remotePatterns: [
      // Vercel Blob Storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
