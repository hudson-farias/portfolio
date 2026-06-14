"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "../reveal"
import { Button } from "@/components/ui/button"
import { AppIcon } from "@/components/icons/app-icon"
import { formatSocialAriaLabel } from "@/lib/social-label"
import type { SocialNetwork } from "../../interfaces"

export const Contact = ({ email, others, profileName, }: { email: string; others: SocialNetwork[]; profileName: string }) => {
  const whatsapp = others.find((network) => network.icon.toLowerCase() === "whatsapp")
  const otherNetworks = others.filter((network) => network.icon.toLowerCase() !== "whatsapp")

  return (
    <section id="contact" className="relative z-0 scroll-mt-28">
      <Reveal variant="scale" duration={700}>
        <div className="surface rounded-3xl px-8 py-14 text-center transition-[transform,colors] duration-300 hover:border-foreground/15 md:px-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Contato</h2>
          <Reveal variant="fade-up" delay={100}>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Escolha o canal que preferir — respondo em até 24 horas.
            </p>
          </Reveal>
          <Reveal variant="fade-up" delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 transition-transform hover:scale-[1.02]">
                <a href={`mailto:${email}`}>
                  {email}
                  <ArrowRight />
                </a>
              </Button>
              {whatsapp && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 transition-transform hover:scale-[1.02]"
                >
                  <a
                    href={whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={formatSocialAriaLabel(whatsapp.icon, profileName)}
                  >
                    <AppIcon name="whatsapp" className="size-5" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </Reveal>
          {otherNetworks.length > 0 && (
            <Reveal variant="fade-up" delay={260}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {otherNetworks.map((network, i) => (
                  <Reveal key={network.id} as="span" variant="scale" delay={280 + i * 80}>
                    <a
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="surface inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-[transform,colors] hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      aria-label={formatSocialAriaLabel(network.icon, profileName)}
                    >
                      <AppIcon name={network.icon} className="size-4" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Reveal>
    </section>
  )
}
