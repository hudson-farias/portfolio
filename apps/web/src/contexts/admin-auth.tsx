"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

import { API } from "@/api/client"

type AdminAuthContextValue = {
  canMutate: boolean
  refreshAuth: () => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children, initialCanMutate = false }: { children: React.ReactNode; initialCanMutate?: boolean }) {
  const [canMutate, setCanMutate] = useState(initialCanMutate)

  const refreshAuth = useCallback(async () => {
    const auth = await API.checkAuth()
    setCanMutate(auth)
  }, [])

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  const logout = () => API.logout()

  return (
    <AdminAuthContext.Provider value={{ canMutate, refreshAuth, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider")
  }
  return context
}
