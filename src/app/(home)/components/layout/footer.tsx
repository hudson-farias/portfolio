"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { formatSocialAriaLabel } from "@/lib/social-label"
import type { FooterResponse } from "../../interfaces"

const footerLinks = [
  { label: "Sobre", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experiência", href: "#experience" },
  { label: "Projetos", href: "#projects" },
  { label: "Contato", href: "#contact" },
]

type FooterLink = {
  key: string
  icon: string
  url: string
}

function buildFooterLinks(footer: FooterResponse): FooterLink[] {
  const links: FooterLink[] = [
    { key: "github", icon: "github", url: footer.github },
    { key: "gitlab", icon: "gitlab", url: footer.gitlab },
    { key: "linkedin", icon: "linkedin", url: footer.linkedin },
  ]

  for (const network of footer.social_networks) {
    links.push({
      key: `network-${network.id}`,
      icon: network.icon,
      url: network.url,
    })
  }

  return links
}

export const Footer = ({
  profileName,
  profileTagline,
  footer,
}: {
  profileName: string
  profileTagline: string
  footer: FooterResponse
}) => {
  const links = buildFooterLinks(footer)

  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:px-10">
        <Reveal variant="fade-up">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{profileName}</p>
            <p className="text-sm text-muted-foreground">{profileTagline}</p>
            <p className="text-sm text-muted-foreground">
              © 2021 — {new Date().getFullYear()} {profileName}. Todos os direitos reservados.
            </p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={80}>
          <div>
            <p className="mb-3 text-sm font-medium">Menu</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={160}>
          <div>
            <p className="mb-3 text-sm font-medium">Redes</p>
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {links.map((link, i) => (
                  <Reveal key={link.key} as="span" variant="scale" delay={200 + i * 80}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="surface inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-[transform,colors] hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      aria-label={formatSocialAriaLabel(link.icon, profileName)}
                    >
                      <AppIcon name={link.icon} className="size-4" />
                    </a>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
