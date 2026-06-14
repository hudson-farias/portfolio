"use client"

import { Send } from "lucide-react"
import { Reveal } from "../reveal"
import { Button } from "@/components/ui/button"
import { AppIcon } from "@/components/icons/app-icon"
import { formatSocialAriaLabel, socialNetworkLabel } from "@/lib/social-label"
import { cn } from "@/lib/utils"
import type { ContactResponse } from "../../interfaces"

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"

type ContactChannelItem = {
  key: string
  href: string
  icon: string
  title: string
  subtitle: string
  external?: boolean
}

function linkSubtitle(url: string) {
  try {
    if (url.startsWith("mailto:")) return url.replace("mailto:", "")
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function buildContactChannels(contact: ContactResponse): ContactChannelItem[] {
  const channels: ContactChannelItem[] = [
    {
      key: "email",
      href: `mailto:${contact.email}`,
      icon: "mail",
      title: "E-mail",
      subtitle: contact.email,
    },
    {
      key: "whatsapp",
      href: contact.whatsapp_url,
      icon: "whatsapp",
      title: "WhatsApp",
      subtitle: "Conversa direta",
      external: true,
    },
    {
      key: "linkedin",
      href: contact.linkedin,
      icon: "linkedin",
      title: "LinkedIn",
      subtitle: "Perfil profissional",
      external: true,
    },
  ]

  for (const network of contact.others) {
    channels.push({
      key: `network-${network.id}`,
      href: network.url,
      icon: network.icon,
      title: socialNetworkLabel(network.icon),
      subtitle: linkSubtitle(network.url),
      external: true,
    })
  }

  return channels
}

function ContactField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}

function ContactChannel({
  channel,
  profileName,
}: {
  channel: ContactChannelItem
  profileName: string
}) {
  return (
    <a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      aria-label={formatSocialAriaLabel(channel.icon, profileName)}
      title={`${channel.title} — ${channel.subtitle}`}
      className="surface flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-[transform,colors] hover:border-foreground/15 hover:-translate-y-0.5"
    >
      <span className="surface inline-flex size-10 shrink-0 items-center justify-center rounded-full">
        <AppIcon name={channel.icon} className="size-4" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-medium">{channel.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{channel.subtitle}</span>
      </span>
    </a>
  )
}

export const Contact = ({
  contact,
  embedded = false,
}: {
  contact: ContactResponse
  embedded?: boolean
}) => {
  const channels = buildContactChannels(contact)

  const content = (
    <Reveal variant="scale" duration={700}>
      <div className="surface cursor-default rounded-3xl px-6 py-10 md:px-10 md:py-12">
        {!embedded ? (
          <Reveal variant="fade-up" className="mx-auto max-w-2xl space-y-3 text-center md:max-w-none md:text-left">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Contato</h2>
            <p className="text-muted-foreground">
              Envie uma mensagem ou escolha outro canal — respondo em até 24 horas.
            </p>
          </Reveal>
        ) : null}

        <div
          className={cn(
            "gap-8",
            !embedded && "mt-8 md:mt-10",
            channels.length > 0 ? "grid md:grid-cols-2 md:items-start" : "mx-auto max-w-xl",
          )}
        >
            <Reveal variant="fade-up" delay={120}>
              <form
                className="space-y-4"
                onSubmit={(event) => event.preventDefault()}
                aria-disabled
              >
                <ContactField label="Nome">
                  <input
                    className={fieldClass}
                    type="text"
                    name="name"
                    placeholder="Seu nome"
                    disabled
                  />
                </ContactField>

                <ContactField label="E-mail">
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    disabled
                  />
                </ContactField>

                <ContactField label="Mensagem">
                  <textarea
                    className={cn(fieldClass, "min-h-32 resize-y")}
                    name="message"
                    placeholder="Conte sobre o projeto, prazo e objetivo..."
                    disabled
                  />
                </ContactField>

                <div className="space-y-2 pt-1">
                  <Button type="submit" className="w-full gap-2 rounded-full sm:w-auto" disabled>
                    <Send className="size-4" />
                    Enviar mensagem
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    O formulário será habilitado em breve.
                  </p>
                </div>
              </form>
            </Reveal>

            {channels.length > 0 && (
              <Reveal variant="fade-up" delay={200} className="space-y-3">
                <p className="text-sm font-medium">Outros canais</p>
                <div className="space-y-2">
                  {channels.map((channel, i) => (
                    <Reveal key={channel.key} variant="scale" delay={220 + i * 60}>
                      <ContactChannel channel={channel} profileName={contact.profile_name} />
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            )}
        </div>
      </div>
    </Reveal>
  )

  if (embedded) {
    return <div className="relative z-0">{content}</div>
  }

  return (
    <section id="contact" className="relative z-0 scroll-mt-28">
      {content}
    </section>
  )
}
