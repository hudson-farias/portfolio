"use client"

import { useEffect, useState } from "react"

import { Save, User } from "lucide-react"

import { API } from "@/api/client"
import type { AdminProfile, ProfileForm, ProfilePageClientProps, ProfileTranslationFields } from "./interfaces"

import { useAdminAuth } from "@/contexts/admin-auth"

import { AlertBanner } from "../components/alert-banner"
import { CheckboxField, Field, TextArea, TextInput, WhatsAppInput } from "../components/form-fields"
import { LocaleTabs } from "../components/locale-tabs"
import { PageHeader } from "../components/page-header"
import { adminMutation } from "../../../lib/admin/admin-toast"
import { hasPendingEn, resolveTranslations, type LocaleCode } from "@/lib/admin/locale"
import { Button } from "@/components/ui/button"

const TRANSLATION_KEYS: (keyof ProfileTranslationFields)[] = ["summary", "about_me", "location"]

function emptyProfileTranslationFields(): ProfileTranslationFields {
  return { summary: "", about_me: "", location: "" }
}

function profileToForm(profile: AdminProfile): ProfileForm {
  return {
    name: profile.name,
    last_name: profile.last_name,
    available: profile.available,
    email: profile.email,
    whatsapp: profile.whatsapp,
    linkedin: profile.linkedin,
    github: profile.github,
    gitlab: profile.gitlab,
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      profile.translations?.pt ?? {},
      profile.translations,
      emptyProfileTranslationFields,
    ),
  }
}

export function ProfilePageClient({ initialProfile }: ProfilePageClientProps) {
  const { canMutate, refreshAuth } = useAdminAuth()

  const [profile, setProfile] = useState(initialProfile)
  const [submitting, setSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("pt")
  const [form, setForm] = useState<ProfileForm | null>(() =>
    initialProfile ? profileToForm(initialProfile) : null,
  )

  useEffect(() => {
    setProfile(initialProfile)
    setForm(initialProfile ? profileToForm(initialProfile) : null)
  }, [initialProfile])

  function setTranslationField(key: keyof ProfileTranslationFields, value: string) {
    if (!form) return

    setForm({
      ...form,
      translations: {
        ...form.translations,
        [activeLocale]: { ...form.translations[activeLocale], [key]: value },
      },
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate || !form) return

    setSubmitting(true)

    const { translations, ...shared } = form
    const data = await adminMutation<AdminProfile>(
      () => API.put("/admin/profile", { ...shared, translations }),
      "Perfil salvo com sucesso.",
    )
    if (!data) {
      setSubmitting(false)
      return
    }
    setProfile(data)
    setForm(profileToForm(data))
    await refreshAuth()
    setSubmitting(false)
  }

  const translationFields = form?.translations[activeLocale]

  return (
    <div>
      <PageHeader
        title="Perfil"
        description="Dados do perfil exibidos no site"
        icon={User}
        canMutate={canMutate}
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para editar o perfil."
          />
        )}

        {!profile || !form || !translationFields ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Nenhum perfil cadastrado no banco de dados.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="space-y-5 p-6 md:p-8">
              <Field label="Nome">
                <TextInput
                  required
                  disabled={!canMutate}
                  placeholder="Ex: Hudson"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>

              <Field label="Sobrenome">
                <TextInput
                  disabled={!canMutate}
                  placeholder="Ex: Farias"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </Field>

              <CheckboxField
                label="Disponível"
                checked={form.available}
                onChange={(checked) => setForm({ ...form, available: checked })}
              />

              <div className="space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <LocaleTabs
                  active={activeLocale}
                  onChange={setActiveLocale}
                  enPending={hasPendingEn(form.translations, TRANSLATION_KEYS)}
                />

                <Field label="Localização">
                  <TextInput
                    disabled={!canMutate}
                    placeholder="Ex: Rio de Janeiro, Brasil"
                    value={translationFields.location}
                    onChange={(e) => setTranslationField("location", e.target.value)}
                  />
                </Field>

                <Field label="Resumo">
                  <TextArea
                    required={activeLocale === "pt"}
                    disabled={!canMutate}
                    placeholder="Breve apresentação profissional..."
                    value={translationFields.summary}
                    onChange={(e) => setTranslationField("summary", e.target.value)}
                  />
                </Field>

                <Field label="Sobre mim">
                  <TextArea
                    required={activeLocale === "pt"}
                    disabled={!canMutate}
                    placeholder="Conte sua trajetória, stack e experiências..."
                    value={translationFields.about_me}
                    onChange={(e) => setTranslationField("about_me", e.target.value)}
                  />
                </Field>
              </div>

              <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Contato profissional</p>
                <div className="space-y-5">
                  <Field label="E-mail">
                    <TextInput
                      required
                      disabled={!canMutate}
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>

                  <Field label="WhatsApp">
                    <WhatsAppInput
                      required
                      disabled={!canMutate}
                      placeholder="+55 (21) 99999-9999"
                      value={form.whatsapp}
                      onChange={(digits) => setForm({ ...form, whatsapp: digits })}
                    />
                  </Field>

                  <Field label="LinkedIn">
                    <TextInput
                      required
                      disabled={!canMutate}
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </Field>

                  <Field label="GitHub">
                    <TextInput
                      required
                      disabled={!canMutate}
                      type="url"
                      placeholder="https://github.com/..."
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                    />
                  </Field>

                  <Field label="GitLab">
                    <TextInput
                      required
                      disabled={!canMutate}
                      type="url"
                      placeholder="https://gitlab.com/..."
                      value={form.gitlab}
                      onChange={(e) => setForm({ ...form, gitlab: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {canMutate && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50 md:px-8">
                <p className="text-sm text-zinc-500">Salve para aplicar as mudanças.</p>
                <Button type="submit" className="gap-1.5" disabled={submitting}>
                  <Save className="size-4" />
                  {submitting ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
