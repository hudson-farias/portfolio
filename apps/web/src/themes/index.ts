export const themes = [
  { id: 'default', label: 'Padrão', folder: 'default' },
  { id: 'noir-blue', label: 'Noir Blue', folder: 'noir-blue' },
] as const

export type ThemeId = typeof themes[number]['id']
