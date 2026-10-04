"use client"

import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSiteLocale } from "@/i18n/site-locale-provider"

export type PendingSuggestionItem =
  | { kind: "summary"; key: string; category: string; detail: string }
  | { kind: "header_role"; key: string; roleId: number; category: string; detail: string }
  | { kind: "experience_role"; key: string; experienceId: number; category: string; detail: string }
  | { kind: "missing_skill"; key: string; name: string; category: string; detail: string }
  | { kind: "filters"; key: string; category: string; detail: string }

export function ResumeAiSuggestionsModal({
  open,
  onOpenChange,
  items,
  savingKey,
  addingName,
  onSaveSummary,
  onSaveHeaderRole,
  onSaveExperienceRole,
  onAddMissingSkill,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: PendingSuggestionItem[]
  savingKey: string | null
  addingName: string | null
  onSaveSummary: () => void
  onSaveHeaderRole: (roleId: number) => void
  onSaveExperienceRole: (experienceId: number) => void
  onAddMissingSkill: (name: string) => void
}) {
  const { t } = useSiteLocale()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(85vh,720px)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.resume.ai.suggestionsTitle}</DialogTitle>
          <DialogDescription>{t.resume.ai.suggestionsDescription}</DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.resume.ai.suggestionsEmpty}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const busy =
                savingKey === item.key ||
                (item.kind === "missing_skill" && addingName === item.name)
              const canSave = item.kind !== "filters"

              return (
                <li
                  key={item.key}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2.5"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{item.category}</p>
                    <p className="line-clamp-3 text-sm text-foreground/90">{item.detail}</p>
                  </div>

                  {canSave ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="shrink-0 rounded-full"
                      disabled={busy || savingKey !== null || addingName !== null}
                      onClick={() => {
                        if (item.kind === "summary") onSaveSummary()
                        else if (item.kind === "header_role") onSaveHeaderRole(item.roleId)
                        else if (item.kind === "experience_role") onSaveExperienceRole(item.experienceId)
                        else if (item.kind === "missing_skill") onAddMissingSkill(item.name)
                      }}
                    >
                      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      {busy
                        ? item.kind === "missing_skill"
                          ? t.resume.ai.addingSkill
                          : t.resume.ai.saving
                        : item.kind === "missing_skill"
                          ? t.resume.ai.addSkill
                          : t.resume.ai.saveSuggestion}
                    </Button>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
