import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor Preview loads the app in a sandboxed iframe (Origin: null).
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "null",
    "cursor.com",
    "*.cursor.com",
    "*.cursor.sh",
    "*.trycloudflare.com",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "tje-tje.myshopify.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/verslun/vara/ullartrefil",
        destination: "/verslun/vara/ullartrefill",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
