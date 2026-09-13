import type { Experience, Project, Skill, SocialNetwork, Tool } from "@/types"

export type { SocialNetwork } from "@/types"

export interface Stats {
  yearsExperience: number
  projectsCount: number
}

export type AboutStats = Stats

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

export interface SkillsResponse {
  skills: Skill[]
  social_networks: SocialNetwork[]
}

export interface ToolsResponse {
  tools: Tool[]
}

export interface ExperiencesResponse {
  experiences: Experience[]
  social_networks: SocialNetwork[]
}

export interface ProjectsResponse {
  projects: Project[]
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

export interface PageResponse {
  hero: HeroResponse
  about: AboutResponse
  skills: SkillsResponse
  tools: ToolsResponse
  experiences: ExperiencesResponse
  projects: ProjectsResponse
  contact: ContactResponse
}
