import { API } from "@/api/server"
import { routes } from "@/lib/site-routes"

import { About } from "./components/page/about"
import { Experiences } from "./components/page/experiences"
import { Hero } from "./components/page/hero"
import { Projects } from "./components/page/projects"
import { StackSkills } from "./components/page/stack-skills"
import { StackTech } from "./components/page/stack-tech"
import { StackDatabases } from "./components/page/stack-databases"
import { Tools } from "./components/page/tools"
import type { AboutStats, PageResponse } from "./interfaces"
import type { Database, Framework } from "@/types"

export default async function Home() {
  const [homeRes, frameworksRes, databasesRes] = await Promise.all([
    API.get("/landpage/home"),
    API.get("/landpage/frameworks"),
    API.get("/landpage/databases"),
  ])

  if (!homeRes.ok) throw new Error("Não foi possível carregar a página inicial.")

  const { hero, about, skills, tools, experiences, projects }: PageResponse =
    await homeRes.json()

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
      <StackTech frameworks={frameworks} />
      <StackDatabases databases={databases} />
      <StackSkills skills={skills.skills} />
      <Tools tools={tools.tools} limit={6} ctaHref={routes.tools} />
      <Experiences experiences={experiences.experiences} limit={1} ctaHref={routes.experience} />
      <Projects projects={projects.projects} limit={2} ctaHref={routes.projects} />
    </>
  )
}
