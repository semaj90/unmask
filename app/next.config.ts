import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      "ipfs.io",
      "gateway.pinata.cloud",
      "res.cloudinary.com",
      "github.com",
    ],
  },
};

export default nextConfig;
