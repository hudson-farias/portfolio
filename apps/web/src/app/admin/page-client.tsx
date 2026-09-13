"use client"

import Link from "next/link"

import { Briefcase, Boxes, Database, FolderGit2, Languages, Layers, Share2, Wrench } from "lucide-react"

import type { AdminPageClientProps } from "./interfaces"

import { useAdminAuth } from "@/contexts/admin-auth"
import { StatCard } from "./components/stat-card"
import { Section } from "./components/section"
import { ExperiencesTable } from "./components/experiences-table"
import { SkillsGrid } from "./components/skills-grid"
import { ProjectsList } from "./components/projects-list"
import { SocialNetworksTable } from "./components/social-networks-table"
import { ToolsTable } from "./components/tools-table"
import { LanguagesTable } from "./components/languages-table"
import { FrameworksTable } from "./components/frameworks-table"
import { DatabasesTable } from "./components/databases-table"

export function AdminPageClient({ data }: AdminPageClientProps) {
    const { canMutate } = useAdminAuth()

    return (
        <div className="space-y-8 p-6 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {canMutate
                            ? "Você pode editar o conteúdo do portfólio."
                            : "Visualização pública — faça login para editar e ver dados privados."}
                    </p>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${canMutate
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border border-zinc-200 text-zinc-500 dark:border-zinc-700"
                        }`}
                >
                    {canMutate ? "Edição liberada" : "Somente leitura"}
                </span>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-8">
                <StatCard label="Experiências" value={data.counts.experiences} />
                <StatCard label="Skills" value={data.counts.skills} />
                <StatCard label="Linguagens" value={data.counts.languages} />
                <StatCard label="Frameworks" value={data.counts.frameworks} />
                <StatCard label="Bancos de dados" value={data.counts.databases} />
                <StatCard label="Projetos" value={data.counts.projects} />
                <StatCard label="Ferramentas" value={data.counts.tools} />
                <StatCard label="Redes sociais" value={data.counts.social_networks} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Section
                    title="Experiências"
                    description="Registros da tabela experiences"
                    icon={Briefcase}
                    canMutate={canMutate}
                    href="/admin/experiences"
                >
                    <ExperiencesTable items={data.experiences} canMutate={false} />
                </Section>

                <Section
                    title="Projetos"
                    description={
                        canMutate
                            ? "Projetos visíveis e repositórios privados"
                            : "Apenas projetos públicos"
                    }
                    icon={FolderGit2}
                    canMutate={canMutate}
                    href="/admin/projects"
                >
                    <ProjectsList items={data.projects} canMutate={false} />
                </Section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Section
                    title="Linguagens"
                    description="Linguagens vinculadas aos frameworks"
                    icon={Languages}
                    canMutate={canMutate}
                    href="/admin/languages"
                >
                    <LanguagesTable items={data.languages} />
                </Section>

                <Section
                    title="Frameworks"
                    description="Frameworks exibidos em /frameworks"
                    icon={Boxes}
                    canMutate={canMutate}
                    href="/admin/frameworks"
                >
                    <FrameworksTable items={data.frameworks} />
                </Section>
            </div>

            <Section
                title="Bancos de dados"
                description="Bancos exibidos em /databases"
                icon={Database}
                canMutate={canMutate}
                href="/admin/databases"
            >
                <DatabasesTable items={data.databases} />
            </Section>

            <Section
                title="Skills"
                description="Skills exibidas no stack e no currículo"
                icon={Layers}
                canMutate={canMutate}
                href="/admin/skills"
            >
                <SkillsGrid skills={data.skills} canMutate={false} />
            </Section>

            <Section
                title="Ferramentas"
                description="Ferramentas exibidas na landpage"
                icon={Wrench}
                canMutate={canMutate}
                href="/admin/tools"
            >
                <ToolsTable items={data.tools} canMutate={false} />
            </Section>

            <Section
                title="Redes sociais"
                description="Links exibidos nas seções da landpage"
                icon={Share2}
                canMutate={canMutate}
                href="/admin/social-networks"
            >
                <SocialNetworksTable
                    items={data.social_networks}
                    canMutate={false}
                />
            </Section>

            <footer className="pb-4 text-center text-xs text-zinc-500">
                <Link href="/" className="underline-offset-4 hover:underline">
                    Ver site público
                </Link>
            </footer>
        </div>
    )
}
