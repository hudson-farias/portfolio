import { SectionLead } from "./section-heading"

/** Page-top intro with calm dual-blue blush wash (same deep↔light pattern as hero). */
export function PageIntro({
  title,
  description,
  eyebrow,
}: {
  title: string
  description: string
  /** Section index label, e.g. `03 / Projetos`. Defaults to `02 / {title}`. */
  eyebrow?: string
}) {
  return (
    <div className="relative isolate overflow-visible">
      {/*
        Stacking: isolate + z-0 (not -z-10). Negative z paints behind the themed
        `bg-background` ancestor and the blush disappears on dedicated pages.
      */}
      <div
        aria-hidden
        className="noir-orb noir-orb--page pointer-events-none absolute -top-10 left-1/2 z-0 h-[min(480px,55vh)] w-[min(920px,150%)] -translate-x-1/2"
      >
        <div className="noir-orb-layer noir-orb-layer--deep absolute inset-[-20%] rounded-full blur-3xl" />
        <div className="noir-orb-layer noir-orb-layer--light absolute inset-[-10%] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-4 border-b border-border/30 pb-12 pt-4 md:pb-16">
        <div className="land-fade-up flex items-center gap-2">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" />
          <span className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
            {eyebrow ?? `02 / ${title}`}
          </span>
        </div>
        <h1 className="land-fade-up land-delay-100 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <SectionLead className="land-fade-up land-delay-200 max-w-2xl text-base leading-relaxed sm:text-lg">
          {description}
        </SectionLead>
      </div>
    </div>
  )
}
