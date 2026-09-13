"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Copy, KeyRound } from "lucide-react"

import { API } from "@/api/client"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/contexts/admin-auth"
import { adminMutation, adminToast } from "@/lib/admin/admin-toast"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { Field, TextInput } from "../components/form-fields"
import { PageHeader } from "../components/page-header"
import type { AdminApiKeyCreated, ApiKeysPageClientProps } from "./interfaces"

const formatWhen = (value: string | null, empty: string) => {
  if (!value) return empty
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return empty
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export const ApiKeysPageClient = ({ initialItems }: ApiKeysPageClientProps) => {
  const router = useRouter()
  const { canMutate } = useAdminAuth()
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canMutate) return
    const trimmed = name.trim()
    if (!trimmed) return

    setSubmitting(true)
    const created = await adminMutation<AdminApiKeyCreated>(
      () => API.post("/admin/api_keys", { name: trimmed }),
      "Chave criada com sucesso.",
    )
    setSubmitting(false)
    if (!created?.key) return

    setCreatedKey(created.key)
    setName("")
    router.refresh()
  }

  const handleCopy = async () => {
    if (!createdKey) return
    try {
      await navigator.clipboard.writeText(createdKey)
    } catch {
      adminToast.error("Não foi possível copiar a chave.")
      return
    }
    adminToast.success("Chave copiada.")
  }

  const handleRevoke = async (id: number) => {
    if (!canMutate) return
    if (!window.confirm("Revogar esta chave? Ela deixará de funcionar.")) return

    const data = await adminMutation(
      () => API.delete(`/admin/api_keys/${id}`),
      "Chave revogada com sucesso.",
    )
    if (!data) return
    router.refresh()
  }

  return (
    <div>
      <PageHeader
        title="Chaves de acesso"
        description="Chaves usadas pela skill do agente. O segredo é exibido somente na criação."
        icon={KeyRound}
        canMutate={canMutate}
      />

      <div className="space-y-4 p-6 md:p-8">
        {createdKey && (
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100"
            role="alert"
          >
            <p className="font-medium">Esta chave só aparece agora. Copie e guarde. Ela não será exibida novamente.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="break-all rounded bg-white px-2 py-1 font-mono text-xs text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                {createdKey}
              </code>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
                <Copy className="size-3.5" />
                Copiar
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setCreatedKey(null)}>
                Ocultar
              </Button>
            </div>
          </div>
        )}

        {canMutate && (
          <form
            method="post"
            onSubmit={handleCreate}
            autoComplete="off"
            className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Field label="Nome" className="min-w-64 flex-1">
              <TextInput
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: skill do agente"
                autoComplete="off"
                required
                disabled={submitting}
              />
            </Field>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Criando..." : "Criar chave"}
            </Button>
          </form>
        )}

        {initialItems.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma chave de acesso cadastrada.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                <th className={adminTh()}>Nome</th>
                <th className={adminTh()}>Prefixo</th>
                <th className={adminTh()}>Criada em</th>
                <th className={adminTh()}>Último uso</th>
                <th className={adminTh()}>Status</th>
                {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {initialItems.map((item) => (
                <tr key={item.id} className={adminBodyRow}>
                  <td className={adminTd()}>{item.name}</td>
                  <td className={adminTd()}>
                    <code className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{item.key_prefix}</code>
                  </td>
                  <td className={adminTd()}>{formatWhen(item.created_at, "—")}</td>
                  <td className={adminTd()}>{formatWhen(item.last_used_at, "Nunca")}</td>
                  <td className={adminTd()}>
                    {item.revoked ? (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800">
                        Revogada
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Ativa
                      </span>
                    )}
                  </td>
                  {canMutate && (
                    <td className={adminTd()}>
                      {!item.revoked && (
                        <Button type="button" size="sm" variant="destructive" onClick={() => handleRevoke(item.id)}>
                          Revogar
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </div>
    </div>
  )
}
