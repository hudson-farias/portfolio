"use client"

import type { AdminRole, RoleForm, RoleSeniority, RoleTranslationFields } from "../interfaces"
import { RolesFormClient } from "../roles-form-client"
import { emptyTranslations, resolveTranslations } from "@/lib/admin/locale"

const TRANSLATION_KEYS: (keyof RoleTranslationFields)[] = ["title", "summary"]

function emptyRoleTranslationFields(): RoleTranslationFields {
  return { title: "", summary: "" }
}

function roleToForm(item: AdminRole): RoleForm {
  return {
    category: item.category ?? "",
    seniority: item.seniority ?? "",
    show: item.show,
    featured: item.featured,
    active: item.active,
    sort_order: item.sort_order,
    color: item.color ?? "",
    icon: item.icon ?? "",
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      item.translations?.pt ?? { title: item.title, summary: "" },
      item.translations,
      emptyRoleTranslationFields,
    ),
  }
}

export const RolesEditPageClient = ({ role }: { role: AdminRole }) => {
  return <RolesFormClient mode="edit" roleId={role.id} initialForm={roleToForm(role)} />
}
