import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ContactCalloutProps } from "@/themes/types"

import { Reveal } from "./reveal"

/** Bottom collaboration CTA on dedicated Noir pages (Stitch contact callout). */
export function ContactCallout({ href, title, description, ctaLabel }: ContactCalloutProps) {
  return (
    <Reveal className="mt-16 border-t border-border/30 pt-10 md:mt-20">
      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-1">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild className="noir-cta shrink-0 rounded-md px-5">
          <Link href={href}>
            {ctaLabel}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </section>
    </Reveal>
  )
}
