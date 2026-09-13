import { API } from "@/api/server"
import { SocialNetworksPageClient } from "./page-client"
import type { AdminSocialNetwork } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function SocialNetworksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/social_networks", await searchParams)
  const items: AdminSocialNetwork[] = await response.json()

  return <SocialNetworksPageClient initialItems={items} />
}
