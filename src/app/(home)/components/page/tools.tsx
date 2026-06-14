"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import type { Tool } from "@/types"

function ToolCard({ tool }: { tool: Tool }) {
  const content = (
    <>
      <AppIcon name={tool.icon} className="size-6" />
      <span className="mt-3 text-sm font-medium">{tool.name}</span>
    </>
  )

  const className =
    "surface flex min-h-[120px] flex-col items-center justify-center rounded-2xl p-6 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`${tool.name} (abre em nova aba)`}
      >
        {content}
      </a>
    )
  }

  return <article className={className}>{content}</article>
}

export const Tools = ({ tools }: { tools: Tool[] }) => {
  if (tools.length === 0) {
    return (
      <section id="tools" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
        <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ferramentas que uso</h2>
          <p className="text-muted-foreground">Em breve novas ferramentas por aqui.</p>
        </Reveal>
      </section>
    )
  }

  return (
    <section id="tools" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
      <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ferramentas que uso</h2>
        <p className="text-muted-foreground">
          O stack de ferramentas que uso no dia a dia para desenvolver.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:grid-cols-4 md:px-10 lg:grid-cols-5">
          {tools.map((tool, index) => (
            <Reveal key={tool.id} variant="scale" delay={80 + index * 60}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
