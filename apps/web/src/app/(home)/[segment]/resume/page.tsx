import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "@/app/(home)/[segment]/_ui/page-intro"
import { getDictionary } from "@/i18n/get-dictionary"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import type { Database, Framework } from "@/types"

import type { ExperiencesResponse } from "../experience/interfaces"
import type { SkillsResponse } from "../skills/interfaces"
import type { ToolsResponse } from "../tools/interfaces"

import { ResumeBuilder } from "./resume-builder"

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
}

export default async function ResumeRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)

  const [skillsRes, frameworksRes, databasesRes, toolsRes, experiencesRes] = await Promise.all([
    API.get("/landpage/skills", { locale }),
    API.get("/landpage/frameworks", { locale }),
    API.get("/landpage/databases", { locale }),
    API.get("/landpage/tools", { locale }),
    API.get("/landpage/experiences", { locale }),
  ])

  if (!skillsRes.ok || !frameworksRes.ok || !databasesRes.ok || !toolsRes.ok || !experiencesRes.ok) {
    throw new Error(t.errors.resumeLoad)
  }

  const { skills }: SkillsResponse = await skillsRes.json()
  const { frameworks }: { frameworks: Framework[] } = await frameworksRes.json()
  const { databases }: { databases: Database[] } = await databasesRes.json()
  const { tools }: ToolsResponse = await toolsRes.json()
  const { experiences }: ExperiencesResponse = await experiencesRes.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.resume.title} description={t.resume.description} />
      <ResumeBuilder
        skills={skills}
        frameworks={frameworks}
        databases={databases}
        tools={tools}
        experiences={experiences}
        apiBaseUrl={getApiBaseUrl()}
      />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.resume.meta.title,
    description: t.resume.meta.description,
  }
}
