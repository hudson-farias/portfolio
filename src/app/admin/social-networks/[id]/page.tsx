import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminSocialNetwork } from "../interfaces"
import { SocialNetworksEditPageClient } from "./page-client"

export default async function SocialNetworksEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const socialNetworkId = Number(id)
  if (!Number.isFinite(socialNetworkId)) notFound()

  const response = await API.get(`/admin/social_networks/${socialNetworkId}`)
  if (!response.ok) notFound()

  const socialNetwork: AdminSocialNetwork = await response.json()
  return <SocialNetworksEditPageClient socialNetwork={socialNetwork} />
}
