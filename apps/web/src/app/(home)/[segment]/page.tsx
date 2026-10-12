import type { Metadata } from "next"

import { API } from "@/api/server"
import { HomePage } from "@/themes/default/home-page"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import type { Database, Framework } from "@/types"

import type { AboutStats, PageResponse } from "./interfaces"

export default async function HomeRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)

  const [homeRes, frameworksRes, databasesRes] = await Promise.all([
    API.get("/landpage/home", { locale }),
    API.get("/landpage/frameworks", { locale }),
    API.get("/landpage/databases", { locale }),
  ])

  if (!homeRes.ok) throw new Error(t.errors.homeLoad)

  const { hero, about, skills, tools, experiences, projects }: PageResponse = await homeRes.json()

  const frameworks: Framework[] = frameworksRes.ok
    ? ((await frameworksRes.json()) as { frameworks: Framework[] }).frameworks
    : []

  const databases: Database[] = databasesRes.ok
    ? ((await databasesRes.json()) as { databases: Database[] }).databases
    : []

  const aboutStats: AboutStats = {
    yearsExperience: about.stats.years_experience,
    projectsCount: about.stats.projects_count,
  }

  return (
    <HomePage
      common={t.common}
      hero={{
        profile: hero.profile,
        copy: t.hero,
        contactHref: routes.contact,
        resumeHref: routes.resume,
      }}
      about={{
        aboutExtended: about.profile.about_extended,
        stats: aboutStats,
        linkedin: about.linkedin,
        socialNetworks: about.social_networks,
        profileName: about.profile_name,
        copy: t.about,
      }}
      experiences={{
        experiences: experiences.experiences,
        copy: t.experience,
        limit: 1,
        ctaHref: routes.experience,
      }}
      projects={{
        projects: projects.projects,
        copy: t.projects,
        limit: 2,
        ctaHref: routes.projects,
      }}
      stack={{
        frameworks,
        copy: t.stackTech,
        frameworksHref: routes.frameworks,
        limit: 8,
      }}
      databases={{
        databases,
        copy: t.stackDatabases,
        databasesHref: routes.databases,
        limit: 8,
      }}
      tools={{
        tools: tools.tools,
        copy: t.tools,
        limit: 6,
        ctaHref: routes.tools,
      }}
      skills={{
        skills: skills.skills,
        copy: t.stackSkills,
        skillsHref: routes.skills,
        limit: 8,
      }}
    />
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.nav.about,
    ...(await localizedPageSeo(locale, "")),
  }
}
