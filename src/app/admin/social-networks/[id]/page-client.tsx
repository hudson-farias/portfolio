"use client"

import type { AdminSocialNetwork } from "../interfaces"
import { SocialNetworksFormClient } from "../social-networks-form-client"

export const SocialNetworksEditPageClient = ({ socialNetwork }: { socialNetwork: AdminSocialNetwork }) => {
  return (
    <SocialNetworksFormClient
      mode="edit"
      socialNetworkId={socialNetwork.id}
      initialForm={{ url: socialNetwork.url, icon: socialNetwork.icon, positions: socialNetwork.positions }}
    />
  )
}
