import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { API } from "@/api/server"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { getRequestOrigin } from "@/lib/request-origin"
import type { LayoutResponse, MetadataResponse } from "@/app/(home)/interfaces"

import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getRequestOrigin()

  const fallback: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Portfólio",
    description: "Portfólio pessoal com projetos, habilidades e contato.",
  }

  const response = await API.get("/landpage/metadata")
  if (!response.ok) return fallback

  const metadata: MetadataResponse = await response.json()

  const roleLabel = metadata.roles.slice(0, 2).join(", ")
  const title = roleLabel ? `${metadata.name} — ${roleLabel}` : metadata.name
  const description = metadata.about

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${metadata.name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteUrl,
      siteName: metadata.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = await getRequestOrigin()

  const response = await API.get("/landpage/layout")
  const { hero, footer, contact }: LayoutResponse = await response.json()

  const sameAs = [
    ...footer.social_networks.map((network) => network.url),
    ...contact.others.map((network) => network.url),
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.profile.name,
    description: hero.profile.about,
    jobTitle: hero.profile.roles[0] ?? undefined,
    url: siteUrl,
    email: contact.email,
    address: { "@type": "PostalAddress", addressLocality: hero.profile.location },
    sameAs: [...new Set(sameAs.filter(Boolean))],
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        {<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
