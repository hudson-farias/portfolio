"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { BadgeCheck, Boxes, Briefcase, Database, FolderGit2, KeyRound, Languages, Layers, LayoutDashboard, Share2, User, Wrench, type LucideIcon } from "lucide-react"

import { useAdminAuth } from "@/contexts/admin-auth"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean }

const links: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Perfil", icon: User },
  { href: "/admin/experiences", label: "Experiências", icon: Briefcase },
  { href: "/admin/projects", label: "Projetos", icon: FolderGit2 },
  { href: "/admin/frameworks", label: "Frameworks", icon: Boxes },
  { href: "/admin/databases", label: "Bancos de dados", icon: Database },
  { href: "/admin/tools", label: "Ferramentas", icon: Wrench },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/languages", label: "Linguagens", icon: Languages },
  { href: "/admin/roles", label: "Cargos", icon: BadgeCheck },
  { href: "/admin/social-networks", label: "Redes sociais", icon: Share2 },
]

const apiKeysLink: NavItem = { href: "/admin/api-keys", label: "Chaves de acesso", icon: KeyRound }

export function AdminNav() {
  const pathname = usePathname()
  const { canMutate } = useAdminAuth()
  const items = canMutate ? [...links, apiKeysLink] : links

  return (
    <nav className="flex-1 space-y-1 p-3">
      {items.map(({ href, label, icon: Icon, exact }) => {
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
