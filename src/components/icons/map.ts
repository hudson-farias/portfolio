import type { ComponentType } from "react"
import { Bot, Code, Database, Globe, Mail, Server, Webhook, Workflow, type LucideIcon } from "lucide-react"

import { DiscordIcon } from "./brands/discord"
import { FacebookIcon } from "./brands/facebook"
import { GithubIcon } from "./brands/github"
import { GitlabIcon } from "./brands/gitlab"
import { InstagramIcon } from "./brands/instagram"
import { LinkedinIcon } from "./brands/linkedin"
import { TelegramIcon } from "./brands/telegram"
import { TiktokIcon } from "./brands/tiktok"
import { WhatsappIcon } from "./brands/whatsapp"
import { XIcon } from "./brands/x"
import { YoutubeIcon } from "./brands/youtube"
import { ArchIcon } from "./tech/arch"
import { AsdfIcon } from "./tech/asdf"
import { CsharpIcon } from "./tech/csharp"
import { CssIcon } from "./tech/css"
import { CursorIcon } from "./tech/cursor"
import { DbeaverIcon } from "./tech/dbeaver"
import { DockerIcon } from "./tech/docker"
import { DotnetIcon } from "./tech/dotnet"
import { FastapiIcon } from "./tech/fastapi"
import { FigmaIcon } from "./tech/figma"
import { GitIcon } from "./tech/git"
import { HtmlIcon } from "./tech/html"
import { InsomniaIcon } from "./tech/insomnia"
import { JavascriptIcon } from "./tech/javascript"
import { LaravelIcon } from "./tech/laravel"
import { LinuxIcon } from "./tech/linux"
import { KubernetesIcon } from "./tech/kubernetes"
import { MongodbIcon } from "./tech/mongodb"
import { MysqlIcon } from "./tech/mysql"
import { NextjsIcon } from "./tech/nextjs"
import { NeovimIcon } from "./tech/neovim"
import { NginxIcon } from "./tech/nginx"
import { NodejsIcon } from "./tech/nodejs"
import { PhpIcon } from "./tech/php"
import { PgadminIcon } from "./tech/pgadmin"
import { PlaywrightIcon } from "./tech/playwright"
import { PostgresqlIcon } from "./tech/postgresql"
import { PostmanIcon } from "./tech/postman"
import { PythonIcon } from "./tech/python"
import { ReactIcon } from "./tech/react"
import { RedisIcon } from "./tech/redis"
import { SwaggerIcon } from "./tech/swagger"
import { TailwindIcon } from "./tech/tailwind"
import { TypescriptIcon } from "./tech/typescript"
import { ViteIcon } from "./tech/vite"
import { VscodeIcon } from "./tech/vscode"
import { VscodiumIcon } from "./tech/vscodium"
import { ZshIcon } from "./tech/zsh"
import type { IconProps } from "./types"

type SvgIconComponent = ComponentType<IconProps>
type IconComponent = LucideIcon | SvgIconComponent

export const iconNames = [
  "api",
  "arch",
  "asdf",
  "bot",
  "code",
  "csharp",
  "css",
  "cursor",
  "database",
  "dbeaver",
  "discord",
  "docker",
  "dotnet",
  "facebook",
  "fastapi",
  "figma",
  "git",
  "github",
  "gitlab",
  "globe",
  "html",
  "insomnia",
  "instagram",
  "javascript",
  "laravel",
  "kubernetes",
  "linkedin",
  "linux",
  "mail",
  "mongodb",
  "mysql",
  "neovim",
  "nextjs",
  "nginx",
  "nodejs",
  "php",
  "pgadmin",
  "pipeline",
  "playwright",
  "postgresql",
  "postman",
  "python",
  "react",
  "redis",
  "server",
  "swagger",
  "tailwind",
  "telegram",
  "tiktok",
  "typescript",
  "vite",
  "vscode",
  "vscodium",
  "whatsapp",
  "x",
  "youtube",
  "zsh",
] as const

export const socialIconNames = [
  "discord",
  "facebook",
  "github",
  "gitlab",
  "globe",
  "instagram",
  "linkedin",
  "mail",
  "telegram",
  "tiktok",
  "whatsapp",
  "x",
  "youtube",
] as const

const profileContactIconNames = new Set([
  "github",
  "gitlab",
  "linkedin",
  "mail",
  "telegram",
  "whatsapp",
])

export const adminSocialIconNames = socialIconNames.filter(
  (name) => !profileContactIconNames.has(name),
)

export const languageIconNames = [
  "csharp",
  "css",
  "html",
  "javascript",
  "nodejs",
  "php",
  "python",
  "typescript",
] as const

export const frameworkIconNames = [
  "dotnet",
  "fastapi",
  "laravel",
  "nextjs",
  "nodejs",
  "react",
  "tailwind",
  "vite",
] as const

export const databaseIconNames = [
  "database",
  "mongodb",
  "mysql",
  "postgresql",
  "redis",
] as const

export const skillIconNames = [
  "api",
  "arch",
  "bot",
  "code",
  "database",
  "globe",
  "pipeline",
  "server",
] as const

export const roleIconNames = [
  "api",
  "arch",
  "bot",
  "code",
  "database",
  "globe",
  "pipeline",
  "server",
] as const

export const toolIconNames = [
  "api",
  "arch",
  "asdf",
  "bot",
  "cursor",
  "database",
  "dbeaver",
  "docker",
  "figma",
  "git",
  "insomnia",
  "kubernetes",
  "linux",
  "neovim",
  "nginx",
  "pgadmin",
  "pipeline",
  "playwright",
  "postman",
  "server",
  "swagger",
  "vscode",
  "vscodium",
  "zsh",
] as const

export const iconMap: Record<string, IconComponent> = {
  api: Webhook,
  arch: ArchIcon,
  asdf: AsdfIcon,
  bot: Bot,
  code: Code,
  csharp: CsharpIcon,
  css: CssIcon,
  cursor: CursorIcon,
  database: Database,
  dbeaver: DbeaverIcon,
  discord: DiscordIcon,
  docker: DockerIcon,
  dotnet: DotnetIcon,
  facebook: FacebookIcon,
  fastapi: FastapiIcon,
  figma: FigmaIcon,
  git: GitIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  globe: Globe,
  html: HtmlIcon,
  insomnia: InsomniaIcon,
  instagram: InstagramIcon,
  javascript: JavascriptIcon,
  js: JavascriptIcon,
  laravel: LaravelIcon,
  kubernetes: KubernetesIcon,
  linkedin: LinkedinIcon,
  linux: LinuxIcon,
  mail: Mail,
  mongo: MongodbIcon,
  mongodb: MongodbIcon,
  mysql: MysqlIcon,
  neovim: NeovimIcon,
  nextjs: NextjsIcon,
  nginx: NginxIcon,
  nodejs: NodejsIcon,
  php: PhpIcon,
  pgadmin: PgadminIcon,
  pipeline: Workflow,
  playwright: PlaywrightIcon,
  postgresql: PostgresqlIcon,
  postman: PostmanIcon,
  python: PythonIcon,
  react: ReactIcon,
  redis: RedisIcon,
  server: Server,
  sql: Database,
  swagger: SwaggerIcon,
  tailwind: TailwindIcon,
  telegram: TelegramIcon,
  tiktok: TiktokIcon,
  typescript: TypescriptIcon,
  vite: ViteIcon,
  vscode: VscodeIcon,
  vscodium: VscodiumIcon,
  whatsapp: WhatsappIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  zsh: ZshIcon,
}
