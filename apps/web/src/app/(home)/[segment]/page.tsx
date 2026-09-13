import type { Metadata } from "next"

import { API } from "@/api/server"
import { About } from "@/app/(home)/[segment]/_ui/page/about"
import { Experiences } from "@/app/(home)/[segment]/_ui/page/experiences"
import { Hero } from "@/app/(home)/[segment]/_ui/page/hero"
import { Projects } from "@/app/(home)/[segment]/_ui/page/projects"
import { StackDatabases } from "@/app/(home)/[segment]/_ui/page/stack-databases"
import { StackSkills } from "@/app/(home)/[segment]/_ui/page/stack-skills"
import { StackTech } from "@/app/(home)/[segment]/_ui/page/stack-tech"
import { Tools } from "@/app/(home)/[segment]/_ui/page/tools"
import { getDictionary } from "@/i18n/get-dictionary"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { localizedRoutes } from "@/i18n/routes"
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
    <>
      <Hero profile={hero.profile} />
      <About
        aboutExtended={about.profile.about_extended}
        stats={aboutStats}
        linkedin={about.linkedin}
        socialNetworks={about.social_networks}
        profileName={about.profile_name}
      />
      <Experiences experiences={experiences.experiences} limit={1} ctaHref={routes.experience} />
      <Projects projects={projects.projects} limit={2} layout="grid" ctaHref={routes.projects} />
      <StackTech frameworks={frameworks} />
      <StackDatabases databases={databases} />
      <Tools tools={tools.tools} limit={6} ctaHref={routes.tools} />
      <StackSkills skills={skills.skills} />
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.nav.about,
  }
}
