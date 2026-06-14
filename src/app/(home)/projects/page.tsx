import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { Projects } from "../components/page/projects"
import type { ProjectsResponse } from "../interfaces"

export const metadata: Metadata = {
  title: "Projetos",
  description: "Seleção de projetos e trabalhos recentes.",
}

export default async function ProjetosPage() {
  const response = await API.get("/landpage/projects")
  if (!response.ok) throw new Error("Não foi possível carregar os projetos.")

  const { projects }: ProjectsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Projetos"
        description="Seleção de trabalhos recentes."
      />
      <Projects projects={projects} layout="grid" embedded />
    </div>
  )
}
