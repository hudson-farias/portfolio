import type { Dictionary } from "@/i18n/dictionary"
import type { HomePageProps } from "@/themes/types"

import { About } from "./page/about"
import { Experiences } from "./page/experiences"
import { Hero } from "./page/hero"
import { Projects } from "./page/projects"
import { StackDatabases } from "./page/stack-databases"
import { StackSkills } from "./page/stack-skills"
import { StackTech } from "./page/stack-tech"
import { Tools } from "./page/tools"

type HomePageCommon = {
  common: Dictionary["common"]
}

export function HomePage({
  hero,
  about,
  experiences,
  projects,
  stack,
  databases,
  tools,
  skills,
  common,
}: HomePageProps & HomePageCommon) {
  return (
    <>
      <Hero
        profile={hero.profile}
        copy={hero.copy}
        contactHref={hero.contactHref}
        resumeHref={hero.resumeHref}
      />
      <About
        aboutExtended={about.aboutExtended}
        stats={about.stats}
        linkedin={about.linkedin}
        socialNetworks={about.socialNetworks}
        profileName={about.profileName}
        copy={about.copy}
      />
      <Experiences
        experiences={experiences.experiences}
        copy={experiences.copy}
        limit={experiences.limit}
        ctaHref={experiences.ctaHref}
      />
      <Projects
        projects={projects.projects}
        copy={projects.copy}
        common={{
          noDescription: common.noDescription,
          repository: common.repository,
          demo: common.demo,
        }}
        limit={projects.limit}
        ctaHref={projects.ctaHref}
        layout="grid"
      />
      <StackTech
        frameworks={stack.frameworks}
        copy={stack.copy}
        common={common}
        frameworksHref={stack.frameworksHref}
        limit={stack.limit}
      />
      <StackDatabases
        databases={databases.databases}
        copy={databases.copy}
        common={{ sql: common.sql, nosql: common.nosql }}
        databasesHref={databases.databasesHref}
        limit={databases.limit}
      />
      <Tools
        tools={tools.tools}
        copy={tools.copy}
        common={{ opensInNewTab: common.opensInNewTab }}
        limit={tools.limit}
        ctaHref={tools.ctaHref}
      />
      <StackSkills
        skills={skills.skills}
        copy={skills.copy}
        skillsHref={skills.skillsHref}
        limit={skills.limit}
      />
    </>
  )
}
