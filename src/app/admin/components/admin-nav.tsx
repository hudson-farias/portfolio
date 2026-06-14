"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { BadgeCheck, Briefcase, FolderGit2, Layers, LayoutDashboard, Share2, User, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Perfil", icon: User },
  { href: "/admin/roles", label: "Cargos", icon: BadgeCheck },
  { href: "/admin/experiences", label: "Experiências", icon: Briefcase },
  { href: "/admin/projects", label: "Projetos", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/tools", label: "Ferramentas", icon: Wrench },
  { href: "/admin/social-networks", label: "Redes sociais", icon: Share2 },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 p-3">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
