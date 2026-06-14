const ICON_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  github: "GitHub",
  gitlab: "GitLab",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  discord: "Discord",
  telegram: "Telegram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  mail: "E-mail",
}

export function socialNetworkLabel(icon: string): string {
  return ICON_LABELS[icon.toLowerCase()] ?? icon
}

export function formatSocialAriaLabel(icon: string, profileName: string): string {
  const network = ICON_LABELS[icon.toLowerCase()] ?? icon
  return `${network} de ${profileName}`
}
