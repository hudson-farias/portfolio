"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Download, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { HeroCopy, HeroProfile } from "@/themes/types"

const TYPE_MS = 100
const DELETE_MS = 55
const PAUSE_TYPED_MS = 1200
const PAUSE_DELETED_MS = 300

const isAvailabilityRole = (role: string) => /^(disponível|available)/i.test(role.trim())

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return reduced
}

const TypingCaret = () => (
  <span
    className="noir-typing-caret ml-[0.08em] inline-block h-[0.85em] w-[0.07em] translate-y-[0.06em] bg-current align-middle"
    aria-hidden
  />
)

const TypingName = ({
  name,
  reducedMotion,
  onComplete,
}: {
  name: string
  reducedMotion: boolean
  onComplete: () => void
}) => {
  const [text, setText] = useState("")
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onCompleteRef.current()
  }, [])

  useEffect(() => {
    completedRef.current = false
    if (reducedMotion || name.length === 0) {
      setText(name)
      finish()
      return
    }
    setText("")
  }, [name, reducedMotion, finish])

  useEffect(() => {
    if (reducedMotion || completedRef.current) return
    if (text === name) {
      finish()
      return
    }

    const timeout = setTimeout(() => {
      setText(name.slice(0, text.length + 1))
    }, TYPE_MS)
    return () => clearTimeout(timeout)
  }, [text, name, reducedMotion, finish])

  return (
    <>
      {text}
      {!reducedMotion ? <TypingCaret /> : null}
    </>
  )
}

const TypingRoles = ({
  roles,
  reducedMotion,
  enabled,
}: {
  roles: string[]
  reducedMotion: boolean
  enabled: boolean
}) => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  const firstRole = roles[0] ?? ""

  useEffect(() => {
    if (reducedMotion) {
      setText(firstRole)
      setDeleting(false)
      setPaused(false)
      setRoleIndex(0)
      return
    }

    if (!enabled) {
      setText("")
      setDeleting(false)
      setPaused(false)
      setRoleIndex(0)
    }
  }, [reducedMotion, enabled, firstRole])

  useEffect(() => {
    if (reducedMotion || !enabled || roles.length === 0) return

    const current = roles[roleIndex]
    if (!current) return

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
  }, [text, deleting, roleIndex, roles, paused, reducedMotion, enabled])

  if (!firstRole) return null

  return (
    <>
      {text}
      {!reducedMotion && enabled ? <TypingCaret /> : null}
    </>
  )
}

export const Hero = ({
  profile,
  copy,
  contactHref,
  resumeHref,
}: {
  profile: HeroProfile
  copy: HeroCopy
  contactHref: string
  resumeHref: string
}) => {
  const reducedMotion = usePrefersReducedMotion()
  const [nameDone, setNameDone] = useState(false)

  const displayName = profile.name.trim()

  const roles = useMemo(() => {
    if (!profile.available) return profile.roles

    const filtered = profile.roles.filter((role) => !isAvailabilityRole(role))
    return filtered.length > 0 ? filtered : profile.roles
  }, [profile.available, profile.roles])

  const handleNameComplete = useCallback(() => setNameDone(true), [])

  useEffect(() => {
    if (reducedMotion) setNameDone(true)
  }, [reducedMotion])

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100vh-5.5rem)] scroll-mt-28 flex-col justify-center overflow-visible py-10 md:py-16"
    >
      <div
        aria-hidden
        className="noir-orb pointer-events-none absolute -top-8 left-1/2 z-0 h-[550px] w-[min(1000px,140%)] -translate-x-1/2"
      >
        <div className="noir-orb-layer noir-orb-layer--deep absolute inset-[-15%] rounded-full blur-3xl" />
        <div className="noir-orb-layer noir-orb-layer--light absolute inset-[-8%] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {profile.available ? (
          <p className="land-fade-up mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            {copy.available}
          </p>
        ) : null}

        <h1 className="land-fade-up font-heading text-[3.5rem] leading-none font-bold tracking-tight select-none sm:text-[5.5rem] md:text-[7.5rem]">
          <span className="sr-only">{displayName}</span>
          <span aria-hidden>
            <TypingName
              name={displayName}
              reducedMotion={reducedMotion}
              onComplete={handleNameComplete}
            />
          </span>
        </h1>

        {roles.length > 0 ? (
          <p className="land-fade-up land-delay-100 mt-6 font-heading text-xl font-semibold tracking-tight md:text-2xl">
            <span className="sr-only">{roles.join(", ")}</span>
            <span aria-hidden>
              <TypingRoles
                roles={roles}
                reducedMotion={reducedMotion}
                enabled={nameDone || reducedMotion}
              />
            </span>
          </p>
        ) : null}

        <p className="land-fade-up land-delay-200 mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {profile.about}
        </p>

        <div className="land-fade-up land-delay-300 mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-primary" />
          <span>{profile.location}</span>
        </div>

        <div className="land-fade-up land-delay-400 mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="noir-cta rounded-md px-7">
            <Link href={contactHref}>
              {copy.ctaContact}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="noir-cta rounded-md px-7">
            <Link href={resumeHref}>
              <Download data-icon="inline-start" />
              {copy.ctaResume}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
