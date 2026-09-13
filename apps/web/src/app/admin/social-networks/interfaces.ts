export interface AdminSocialNetwork {
  id: number
  url: string
  icon: string
  positions: string[]
}

export interface SocialNetworkForm {
  url: string
  icon: string
  positions: string[]
}

export interface SocialNetworksPageClientProps {
  initialItems: AdminSocialNetwork[]
}
