import { headers } from "next/headers"

export async function getRequestOrigin(): Promise<string> {
  const h = await headers()
  const host = (h.get("x-forwarded-host") ?? h.get("host"))?.split(",")[0]?.trim()

  if (!host) {
    return "http://localhost:3000"
  }

  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")

  return `${proto}://${host}`.replace(/\/$/, "")
}
