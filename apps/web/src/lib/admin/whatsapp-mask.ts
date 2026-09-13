export const WHATSAPP_MAX_DIGITS = 15

export function whatsappDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, WHATSAPP_MAX_DIGITS)
}

export function formatWhatsAppMask(digits: string) {
  const normalized = whatsappDigits(digits)
  if (!normalized) return ""

  if (normalized.startsWith("55")) {
    const ddd = normalized.slice(2, 4)
    const local = normalized.slice(4)

    let formatted = "+55"
    if (ddd.length > 0) formatted += ` (${ddd}`
    if (ddd.length === 2) formatted += ")"
    if (local.length > 0) formatted += ` ${local.slice(0, 5)}`
    if (local.length > 5) formatted += `-${local.slice(5, 9)}`
    return formatted
  }

  return `+${normalized}`
}
