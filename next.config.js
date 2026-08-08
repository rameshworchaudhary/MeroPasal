/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.asia-east1.run.app", "localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.itechstore.com.np",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

