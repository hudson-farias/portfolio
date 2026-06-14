export type ResumeAreaSlug = "frameworks" | "databases" | "skills"

export type ResumeAreaSection = {
  slug: ResumeAreaSlug
  title: string
  description: string
}

export const RESUME_AREA_SECTIONS: ResumeAreaSection[] = [
  {
    slug: "frameworks",
    title: "Frameworks",
    description: "Frameworks e bibliotecas do meu dia a dia em backend e frontend.",
  },
  {
    slug: "databases",
    title: "Banco de dados",
    description: "Bancos e tecnologias de persistência com que trabalho.",
  },
  {
    slug: "skills",
    title: "Skills",
    description: "Conceitos, práticas e competências que complementam o stack técnico.",
  },
]
