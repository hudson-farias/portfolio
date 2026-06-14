import { cn } from "@/lib/utils"

import { formatWhatsAppMask, whatsappDigits } from "../lib/whatsapp-mask"

const fieldClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: React.ComponentProps<"input">) {
  return <input className={fieldClass} {...props} />
}

export function WhatsAppInput({
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange" | "type" | "inputMode"> & {
  value: string
  onChange: (digits: string) => void
}) {
  return (
    <input
      className={cn(fieldClass, className)}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={formatWhatsAppMask(value)}
      onChange={(e) => onChange(whatsappDigits(e.target.value))}
      {...props}
    />
  )
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-24 resize-y")} {...props} />
}

export function SelectInput(props: React.ComponentProps<"select">) {
  return <select className={fieldClass} {...props} />
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-zinc-300 dark:border-zinc-600"
      />
      {label}
    </label>
  )
}
