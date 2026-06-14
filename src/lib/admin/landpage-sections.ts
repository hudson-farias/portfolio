export const LANDPAGE_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "Sobre mim" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experiência" },
  { id: "projects", label: "Projetos" },
  { id: "contact", label: "Contato" },
  { id: "footer", label: "Footer" },
] as const

export type LandpageSectionId = (typeof LANDPAGE_SECTIONS)[number]["id"]

const sectionLabels = Object.fromEntries(
  LANDPAGE_SECTIONS.map(({ id, label }) => [id, label]),
) as Record<LandpageSectionId, string>

export function formatLandpageSections(positions: string[]) {
  if (positions.length === 0) return "—"

  return positions
    .map((position) => sectionLabels[position as LandpageSectionId] ?? position)
    .join(" · ")
}
