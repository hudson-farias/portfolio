export interface AdminProfile {
  name: string
  last_name: string
  summary: string
  about_me: string
  location: string
  available: boolean
  email: string
  whatsapp: string
  linkedin: string
  github: string
  gitlab: string
}

export interface ProfileForm {
  name: string
  last_name: string
  summary: string
  about_me: string
  location: string
  available: boolean
  email: string
  whatsapp: string
  linkedin: string
  github: string
  gitlab: string
}

export interface ProfilePageClientProps {
  initialProfile: AdminProfile | null
}
