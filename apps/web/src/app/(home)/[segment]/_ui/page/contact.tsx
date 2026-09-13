"use client"

import { Send } from "lucide-react"
import { Reveal } from "../reveal"
import { Button } from "@/components/ui/button"
import { AppIcon } from "@/components/icons/app-icon"
import { formatSocialAriaLabel, socialNetworkLabel } from "@/lib/social-label"
import { cn } from "@/lib/utils"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { ContactResponse } from "@/app/(home)/[segment]/interfaces"
import type { Dictionary } from "@/i18n/dictionary"

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

function buildContactChannels(contact: ContactResponse, labels: Dictionary["contact"]): ContactChannelItem[] {
  const channels: ContactChannelItem[] = [
    {
      key: "email",
      href: `mailto:${contact.email}`,
      icon: "mail",
      title: labels.emailTitle,
      subtitle: contact.email,
    },
    {
      key: "whatsapp",
      href: contact.whatsapp_url,
      icon: "whatsapp",
      title: labels.whatsappTitle,
      subtitle: labels.whatsappSubtitle,
      external: true,
    },
    {
      key: "linkedin",
      href: contact.linkedin,
      icon: "linkedin",
      title: labels.linkedinTitle,
      subtitle: labels.linkedinSubtitle,
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
  const { t } = useSiteLocale()
  const channels = buildContactChannels(contact, t.contact)

  const content = (
    <Reveal variant="scale" duration={700}>
      <div className="surface cursor-default rounded-3xl px-6 py-10 md:px-10 md:py-12">
        {!embedded ? (
          <Reveal variant="fade-up" className="mx-auto max-w-2xl space-y-3 text-center md:max-w-none md:text-left">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.contact.title}</h2>
            <p className="text-muted-foreground">{t.contact.description}</p>
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
                <ContactField label={t.contact.name}>
                  <input
                    className={fieldClass}
                    type="text"
                    name="name"
                    placeholder={t.contact.namePlaceholder}
                    disabled
                  />
                </ContactField>

                <ContactField label={t.contact.email}>
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    placeholder={t.contact.emailPlaceholder}
                    disabled
                  />
                </ContactField>

                <ContactField label={t.contact.message}>
                  <textarea
                    className={cn(fieldClass, "min-h-32 resize-y")}
                    name="message"
                    placeholder={t.contact.messagePlaceholder}
                    disabled
                  />
                </ContactField>

                <div className="space-y-2 pt-1">
                  <Button type="submit" className="w-full gap-2 rounded-full sm:w-auto" disabled>
                    <Send className="size-4" />
                    {t.contact.submit}
                  </Button>
                  <p className="text-xs text-muted-foreground">{t.contact.formDisabled}</p>
                </div>
              </form>
            </Reveal>

            {channels.length > 0 && (
              <Reveal variant="fade-up" delay={200} className="space-y-3">
                <p className="text-sm font-medium">{t.contact.otherChannels}</p>
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
