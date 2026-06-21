import type { SocialNetwork } from "@/types"

export interface HeroProfile {
  name: string
  roles: string[]
  location: string
  email: string
  about: string
  available: boolean
}

export interface HeroResponse {
  profile: HeroProfile
  social_networks: SocialNetwork[]
}

export interface FooterResponse {
  github: string
  gitlab: string
  linkedin: string
  career_start: number
  social_networks: SocialNetwork[]
}

export interface ContactResponse {
  email: string
  whatsapp_url: string
  linkedin: string
  github: string
  gitlab: string
  others: SocialNetwork[]
  profile_name: string
}

export interface LayoutResponse {
  hero: HeroResponse
  footer: FooterResponse
  contact: ContactResponse
}

export interface MetadataResponse {
  name: string
  roles: string[]
  about: string
}
