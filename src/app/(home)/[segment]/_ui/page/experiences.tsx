"use client"

import { ExternalLink } from "lucide-react"

import { Reveal } from "../reveal"
import { SanitizedHtml } from "@/components/sanitized-html"
import { SectionCta } from "../section-cta"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { Experience } from "@/types"

export const Experiences = ({
  experiences,
  limit,
  ctaHref,
  ctaLabel,
  embedded = false,
}: {
  experiences: Experience[]
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  embedded?: boolean
}) => {
  const { t } = useSiteLocale()
  const visibleExperiences = limit ? experiences.slice(0, limit) : experiences
  const resolvedCtaLabel = ctaLabel ?? t.experience.ctaFull

  const heading = (
    <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.experience.title}</h2>
      <p className="text-muted-foreground">{t.experience.description}</p>
    </Reveal>
  )
  return (
    <section id="experience" className="scroll-mt-28 space-y-10">
      {!embedded ? heading : null}

      <div className="relative mx-auto max-w-3xl space-y-4">
        <Reveal
          variant="fade"
          duration={900}
          className="absolute top-2 bottom-2 left-[1.125rem] hidden md:block"
        >
          <div aria-hidden className="h-full w-px bg-border" />
        </Reveal>

        {visibleExperiences.map((experience, i) => {
          const title = [
            `${experience.role} — ${experience.company}`,
            experience.period,
            experience.contract_type,
          ]
            .filter(Boolean)
            .join(" · ")

          return (
          <Reveal key={experience.id} delay={i * 120} variant="fade-left">
            <article
              className="surface surface-card-static relative z-0 rounded-2xl p-6 transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:border-foreground/20 hover:shadow-lg md:pl-10"
              title={title}
            >
              <span
                aria-hidden
                className="absolute top-7 left-6 hidden size-2.5 rounded-full border-2 border-primary bg-background md:block"
              />

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{experience.role}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-muted-foreground">{experience.company}</p>
                    {experience.live_url && (
                      <a
                        href={experience.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        {t.experience.liveUrlLabel}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {experience.contract_type && (
                    <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {experience.contract_type}
                    </span>
                  )}
                  <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {experience.period}
                  </span>
                </div>
              </div>
              <SanitizedHtml
                html={experience.description}
                className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground"
              />
            </article>
          </Reveal>
          )
        })}
      </div>

      {ctaHref && experiences.length > visibleExperiences.length ? (
        <SectionCta href={ctaHref} label={resolvedCtaLabel} />
      ) : null}
    </section>
  )
}
