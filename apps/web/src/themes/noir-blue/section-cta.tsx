import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex justify-start pt-2 md:justify-start">
      <Link
        href={href}
        className="noir-cta inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
      >
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
