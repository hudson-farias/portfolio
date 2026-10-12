"use client"

import type { ReactNode } from "react"
import { ExternalLink } from "lucide-react"

import { SanitizedHtml } from "@/components/sanitized-html"
import type { Experience, ExperiencesCopy } from "@/themes/types"

import { FrameworkBadges } from "../framework-badges"
import { Reveal } from "../reveal"
import { SectionCta } from "../section-cta"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

function ExperienceArticle({
  experience,
  copy,
  footer,
}: {
  experience: Experience
  copy: ExperiencesCopy
  footer?: ReactNode
}) {
  const title = [
    `${experience.role} — ${experience.company}`,
    experience.period,
    experience.contract_type,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <article
      title={title}
      className="noir-tile rounded-lg border border-border/40 bg-card p-6 hover:border-primary/50 md:p-8"
    >
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {experience.role}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {experience.contract_type ? (
            <span className="rounded border border-border/50 bg-background px-3 py-1 text-xs text-muted-foreground">
              {experience.contract_type}
            </span>
          ) : null}
          <span className="rounded border border-border/50 bg-background px-3 py-1 text-xs text-muted-foreground">
            {experience.period}
          </span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-primary">{experience.company}</p>
        {experience.live_url ? (
          <a
            href={experience.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            <ExternalLink className="size-3" />
            {copy.liveUrlLabel}
          </a>
        ) : null}
      </div>

      <SanitizedHtml
        html={experience.description}
        className="mb-0 space-y-2 text-sm leading-relaxed text-muted-foreground"
      />

      {experience.frameworks?.length ? (
        <div className="mt-5">
          <FrameworkBadges frameworks={experience.frameworks} />
        </div>
      ) : null}

      {footer}
    </article>
  )
}

export const Experiences = ({
  experiences,
  copy,
  limit,
  ctaHref,
  ctaLabel,
  embedded = false,
}: {
  experiences: Experience[]
  copy: ExperiencesCopy
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  embedded?: boolean
}) => {
  const visibleExperiences = limit ? experiences.slice(0, limit) : experiences
  const resolvedCtaLabel = ctaLabel ?? copy.ctaFull
  const showCta = Boolean(ctaHref && experiences.length > visibleExperiences.length)

  if (embedded) {
    return (
      <section id="experience" className="scroll-mt-28 relative py-4 md:py-6">
        <div className="relative space-y-6 md:space-y-8">
          <Reveal variant="fade" duration={900} className="absolute top-2 bottom-6 left-3 hidden md:block">
            <div
              aria-hidden
              className="h-full w-px bg-gradient-to-b from-primary via-primary/40 to-border"
            />
          </Reveal>

          {visibleExperiences.map((experience, i) => (
            <Reveal key={experience.id} delay={i * 90} className="relative md:pl-10">
              <span
                aria-hidden
                className="absolute top-8 left-3 hidden size-3.5 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:block"
              >
                {i === 0 ? (
                  <span className="absolute inset-[3px] rounded-full bg-primary" />
                ) : null}
              </span>
              <ExperienceArticle experience={experience} copy={copy} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionEyebrow>02 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead className="mt-3 lg:max-w-xs">{copy.description}</SectionLead>
        </Reveal>

        <div className="flex flex-col gap-4 lg:col-span-8">
          {visibleExperiences.map((experience, i) => (
            <Reveal key={experience.id} delay={i * 100}>
              <ExperienceArticle
                experience={experience}
                copy={copy}
                footer={
                  showCta && i === visibleExperiences.length - 1 ? (
                    <div className="mt-6">
                      <SectionCta href={ctaHref!} label={resolvedCtaLabel} />
                    </div>
                  ) : null
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
