import { cn } from "@/lib/utils"

const proseClassName =
  "[&_a]:text-foreground [&_a]:underline [&_em]:italic [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"

export function SanitizedHtml({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  return (
    <div
      className={cn(proseClassName, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
