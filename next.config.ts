import type { NextConfig } from "next"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
const apiOrigin = apiUrl ? new URL(apiUrl).origin : ""

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin}`.trim(),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/stack", destination: "/", permanent: true },
      { source: "/stack/skills", destination: "/skills", permanent: true },
      { source: "/stack/soft-skills", destination: "/skills", permanent: true },
      { source: "/stack/databases", destination: "/databases", permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ]
  },
}

export default nextConfig
