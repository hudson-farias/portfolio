import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-medium tracking-[0.12em] text-primary uppercase">
      {children}
    </span>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2 className={cn("font-heading text-2xl font-semibold tracking-tight md:text-3xl", className)}>
      {children}
    </h2>
  )
}

export function SectionLead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={cn("text-muted-foreground", className)}>{children}</p>
}
