import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { DatabasesView } from "../components/page/databases-view"
import type { Database } from "@/types"

export const metadata: Metadata = {
  title: "Banco de dados",
  description: "Bancos e tecnologias de persistência com que trabalho.",
}

export default async function DatabasesPage() {
  const response = await API.get("/landpage/databases")
  if (!response.ok) throw new Error("Não foi possível carregar os bancos de dados.")

  const { databases }: { databases: Database[] } = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Banco de dados"
        description="Bancos e tecnologias de persistência com que trabalho."
      />
      <DatabasesView databases={databases} />
    </div>
  )
}
