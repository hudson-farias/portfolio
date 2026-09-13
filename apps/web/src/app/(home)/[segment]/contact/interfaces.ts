import type { SocialNetwork } from "@/types"

export interface ContactResponse {
  email: string
  whatsapp_url: string
  linkedin: string
  github: string
  gitlab: string
  others: SocialNetwork[]
  profile_name: string
}

export interface ContactLayoutResponse {
  contact: ContactResponse
}
