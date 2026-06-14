import type { Experience, Project, Skill, SocialNetwork, Tool } from "@/types"
export type { SocialNetwork } from "@/types"

export interface Stats {
  yearsExperience: number
  projectsCount: number
}

export type AboutStats = Stats

export interface ContactResponse {
  email: string
  whatsapp_url: string
  linkedin: string
  github: string
  gitlab: string
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
  skills: Skill[]
  social_networks: SocialNetwork[]
}

export interface ToolsResponse {
  tools: Tool[]
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
  }
  linkedin: string
  social_networks: SocialNetwork[]
  profile_name: string
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
  tools: ToolsResponse
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
  skills: Skill[]
  experiences: Experience[]
  projects: Project[]
}
