import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { Experiences } from "../components/page/experiences"
import type { ExperiencesResponse } from "../interfaces"

export const metadata: Metadata = {
  title: "Experiência",
  description: "Trajetória profissional e principais atuações.",
}

export default async function ExperienciaPage() {
  const response = await API.get("/landpage/experiences")
  if (!response.ok) throw new Error("Não foi possível carregar as experiências.")

  const { experiences }: ExperiencesResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Experiência"
        description="Trajetória profissional e principais atuações."
      />
      <Experiences experiences={experiences} embedded />
    </div>
  )
}
