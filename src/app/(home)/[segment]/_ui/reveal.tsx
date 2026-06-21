"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealVariant = "fade-up" | "fade" | "fade-left" | "fade-right" | "scale"

const variantStyles: Record<RevealVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-6",
    visible: "opacity-100 translate-y-0",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  "fade-left": {
    hidden: "opacity-0 -translate-x-6",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 translate-x-6",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    hidden: "opacity-0 scale-[0.97]",
    visible: "opacity-100 scale-100",
  },
}

interface RevealProps {
  children: ReactNode
  className?: string
  variant?: RevealVariant
  delay?: number
  duration?: number
  as?: ElementType
  immediate?: boolean
}

export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  as: Tag = "div",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(immediate)
  const [done, setDone] = useState(immediate)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduceMotion(prefersReduced)
    if (prefersReduced) {
      setVisible(true)
      setDone(true)
    }
  }, [])

  useEffect(() => {
    if (immediate || reduceMotion) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [immediate, reduceMotion])

  const styles = variantStyles[variant]
  const animating = visible && !done && !reduceMotion

  return (
    <Tag
      ref={ref}
      className={cn(
        animating && "transition-[opacity,transform] ease-out will-change-[opacity,transform]",
        visible ? styles.visible : styles.hidden,
        className,
      )}
      style={
        animating
          ? {
              transitionDuration: `${duration}ms`,
              transitionDelay: `${delay}ms`,
            }
          : undefined
      }
      onTransitionEnd={(e: React.TransitionEvent) => {
        if (e.target !== e.currentTarget) return
        if (visible) setDone(true)
      }}
    >
      {children}
    </Tag>
  )
}
