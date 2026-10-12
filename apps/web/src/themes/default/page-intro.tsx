import { Reveal } from "./reveal"

export function PageIntro({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </Reveal>
  )
}
