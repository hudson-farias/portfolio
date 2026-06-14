import type { Experience, Project, SkillCategory, SocialNetwork } from "@/types"
export type { SocialNetwork } from "@/types"


export interface Profile {
  name: string
  roles: string[]
  location: string
  email: string
  phone: string
  about: string
  about_extended: string
  available: boolean
}

export interface Stats {
  yearsExperience: number
  projectsCount: number
  clientsCount: number
}

export type AboutStats = Stats

export interface PortfolioData {
  profile: Profile
  stats: Stats
  skills: SkillCategory[]
  experiences: Experience[]
  projects: Project[]
  socialNetworksHeader: SocialNetwork[]
  socialNetworksFooter: SocialNetwork[]
}

export interface ContactResponse {
  email: string
  others: SocialNetwork[]
  profile_name: string
}

export interface HeroProfile {
  name: string
  roles: string[]
  location: string
  email: string
  about: string
  available: boolean
}

export interface ExperiencesResponse {
  experiences: Experience[]
  social_networks: SocialNetwork[]
}

export interface SkillsResponse {
  skills: SkillCategory[]
  social_networks: SocialNetwork[]
}

export interface ProjectsResponse {
  projects: Project[]
  social_networks: SocialNetwork[]
}

export interface AboutResponse {
  profile: {
    about_extended: string
  }
  stats: {
    years_experience: number
    projects_count: number
    clients_count: number
  }
  social_networks: SocialNetwork[]
  profile_name: string
}

export interface HeroResponse {
  profile: HeroProfile
  social_networks: SocialNetwork[]
}

export interface FooterResponse {
  social_networks: SocialNetwork[]
}

export interface MetadataResponse {
  name: string
  roles: string[]
  about: string
}

export interface LayoutResponse {
  hero: HeroResponse
  footer: FooterResponse
  contact: ContactResponse
}

export interface PageResponse {
  hero: HeroResponse
  about: AboutResponse
  skills: SkillsResponse
  experiences: ExperiencesResponse
  projects: ProjectsResponse
  contact: ContactResponse
}

export interface LandpageResponse {
  about: AboutResponse
  contact: ContactResponse
  experiences: ExperiencesResponse
  hero: HeroResponse
  projects: ProjectsResponse
  skills: SkillsResponse
  footer: FooterResponse
}

export interface ApiResponse {
  skills: SkillCategory[]
  experiences: Experience[]
  projects: Project[]
}
