import Link from "next/link"
import { Suspense } from "react"

import { ArrowLeft } from "lucide-react"

import { API } from "@/api/server"

import { AdminAuthProvider } from "@/contexts/admin-auth"

import { AdminNav } from "./components/admin-nav"
import { AdminToaster } from "./components/admin-toaster"
import { AdminLayoutClient } from "./layout-client"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const canMutate = await API.checkAuth()

  return (
    <Suspense fallback={null}>
      <AdminAuthProvider initialCanMutate={canMutate}>
        <div className="flex min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
          <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-5 py-5 dark:border-zinc-800">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Portfólio</p>
              <h1 className="mt-1 text-lg font-semibold">Admin</h1>
            </div>

            <AdminNav />

            <AdminLayoutClient />

            <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <ArrowLeft className="size-4" />
                Voltar ao site
              </Link>
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-auto">{children}</main>
          <AdminToaster />
        </div>
      </AdminAuthProvider>
    </Suspense>
  )
}
