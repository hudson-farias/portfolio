import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { Contact } from "../components/page/contact"
import type { LayoutResponse } from "../interfaces"

export const metadata: Metadata = {
  title: "Contato",
  description: "Envie uma mensagem ou escolha um canal para falar sobre projetos e oportunidades.",
}

export default async function ContactPage() {
  const response = await API.get("/landpage/layout")
  if (!response.ok) throw new Error("Não foi possível carregar os dados de contato.")

  const { contact }: LayoutResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Contato"
        description="Envie uma mensagem ou escolha outro canal — respondo em até 24 horas."
      />
      <Contact contact={contact} embedded />
    </div>
  )
}
