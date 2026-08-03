import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // 사진(5MB) + 음원(20MB)을 한 번에 업로드해도 여유 있도록.
      // Next.js Server Action 요청 본문 기본 제한은 1MB라 그대로 두면 "Failed to fetch"로 실패함.
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
