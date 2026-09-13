"use client"

import { LogIn, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

import { API } from "@/api/client"

import { useAdminAuth } from "@/contexts/admin-auth"

export const AdminLayoutClient = () => {
  const { canMutate, logout } = useAdminAuth()

  return (
    <div className="space-y-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
      <p className="px-3 text-xs text-zinc-500">
        {canMutate ? "Sessão ativa — mutations liberadas" : "Modo leitura — dados abertos"}
      </p>

      {canMutate ? (
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full justify-start gap-2 cursor-pointer">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      ) : (
        <Button asChild className="w-full justify-start gap-2">
          <a href={API.loginUrl}>
            <LogIn className="size-4" />
            Entrar
          </a>
        </Button>
      )}
    </div>
  )
}
