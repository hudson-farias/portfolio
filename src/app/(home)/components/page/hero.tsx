"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Download, MapPin } from "lucide-react"
import { routes } from "@/lib/site-routes"
import { Button } from "@/components/ui/button"
import type { HeroProfile } from "../../interfaces"

const TYPE_MS = 100
const DELETE_MS = 55
const PAUSE_TYPED_MS = 1200
const PAUSE_DELETED_MS = 300

const TypingRoles = ({ roles }: { roles: string[] }) => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]

    if (paused) {
      const timeout = setTimeout(
        () => {
          setPaused(false)
          if (text === current) setDeleting(true)
        },
        text === current ? PAUSE_TYPED_MS : PAUSE_DELETED_MS,
      )
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          const next = current.slice(0, text.length + 1)
          setText(next)
          if (next === current) setPaused(true)
        } else {
          const next = current.slice(0, text.length - 1)
          setText(next)
          if (next === "") {
            setDeleting(false)
            setPaused(true)
            setRoleIndex((i) => (i + 1) % roles.length)
          }
        }
      },
      deleting ? DELETE_MS : TYPE_MS,
    )
    return () => clearTimeout(timeout)
  }, [text, deleting, roleIndex, roles, paused])

  return (
    <span className="text-2xl font-semibold tracking-tight md:text-3xl">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}

const isAvailabilityRole = (role: string) => /^disponível/i.test(role.trim())

export const Hero = ({ profile }: { profile: HeroProfile }) => {
  const firstName = profile.name.trim().split(/\s+/)[0]
  const roles = useMemo(() => {
    if (!profile.available) return profile.roles

    const filtered = profile.roles.filter((role) => !isAvailabilityRole(role))
    return filtered.length > 0 ? filtered : profile.roles
  }, [profile.available, profile.roles])

  return (
    <section id="hero" className="scroll-mt-28 space-y-10 pt-8 md:pt-14">
      <div className="mx-auto max-w-4xl space-y-8">
        {profile.available && (
          <p className="surface cursor-default land-fade-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Disponível para projetos
          </p>
        )}

        <div className="space-y-4">
          <h1 className="land-fade-up land-delay-100 text-4xl font-bold tracking-tight md:text-6xl">
            Oi, eu sou {firstName}.
          </h1>
          <div className="land-fade-up land-delay-200">
            <TypingRoles roles={roles} />
          </div>
        </div>

        <p className="land-fade-up land-delay-300 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {profile.about}
        </p>

        <div className="land-fade-up land-delay-400 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {profile.location}
          </span>
        </div>

        <div className="land-fade-up land-delay-500 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-6 transition-transform hover:scale-[1.02]">
            <Link href={routes.contact}>
              Vamos conversar
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-6 transition-transform hover:scale-[1.02]">
            <Link href={routes.resume}>
              <Download />
              Baixar CV
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
