import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SectionCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex justify-center pt-8">
      <Button variant="outline" className="rounded-full" asChild>
        <Link href={href}>
          {label}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
