import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { ResumeBuilder } from "./page-client"
import type { ExperiencesResponse, SkillsResponse, ToolsResponse } from "../interfaces"
import type { Framework, Database } from "@/types"

export const metadata: Metadata = {
  title: "Currículo",
  description: "Gere um currículo em PDF com filtros de stack, ferramentas e experiências.",
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
}

export default async function ResumePage() {
  const [skillsRes, frameworksRes, databasesRes, toolsRes, experiencesRes] = await Promise.all([
    API.get("/landpage/skills"),
    API.get("/landpage/frameworks"),
    API.get("/landpage/databases"),
    API.get("/landpage/tools"),
    API.get("/landpage/experiences"),
  ])

  if (!skillsRes.ok || !frameworksRes.ok || !databasesRes.ok || !toolsRes.ok || !experiencesRes.ok) {
    throw new Error("Não foi possível carregar os dados do currículo.")
  }

  const { skills }: SkillsResponse = await skillsRes.json()
  const { frameworks }: { frameworks: Framework[] } = await frameworksRes.json()
  const { databases }: { databases: Database[] } = await databasesRes.json()
  const { tools }: ToolsResponse = await toolsRes.json()
  const { experiences }: ExperiencesResponse = await experiencesRes.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Gerar currículo"
        description="Monte uma versão do CV filtrando linguagens, frameworks, bancos de dados, ferramentas e experiências."
      />
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
