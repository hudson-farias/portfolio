export const routes = {
  home: "/",
  about: "/#about",
  contact: "/contact",
  frameworks: "/frameworks",
  databases: "/databases",
  skills: "/skills",
  tools: "/tools",
  projects: "/projects",
  experience: "/experience",
  resume: "/resume",
} as const

export type SiteLink = {
  label: string
  href: string
}

export const navItems: SiteLink[] = [
  { label: "Sobre", href: routes.about },
  { label: "Frameworks", href: routes.frameworks },
  { label: "Bancos", href: routes.databases },
  { label: "Skills", href: routes.skills },
  { label: "Ferramentas", href: routes.tools },
  { label: "Experiência", href: routes.experience },
  { label: "Projetos", href: routes.projects },
  { label: "Contato", href: routes.contact },
]

export const footerPageLinks: SiteLink[] = [
  { label: "Sobre", href: routes.about },
  { label: "Ferramentas", href: routes.tools },
  { label: "Experiência", href: routes.experience },
  { label: "Projetos", href: routes.projects },
  { label: "Currículo", href: routes.resume },
  { label: "Contato", href: routes.contact },
]

export const footerStackLinks: SiteLink[] = [
  { label: "Frameworks", href: routes.frameworks },
  { label: "Banco de dados", href: routes.databases },
  { label: "Skills", href: routes.skills },
]
