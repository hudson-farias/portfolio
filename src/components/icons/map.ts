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
import { CsharpIcon } from "./tech/csharp"
import { CssIcon } from "./tech/css"
import { DbeaverIcon } from "./tech/dbeaver"
import { DockerIcon } from "./tech/docker"
import { DotnetIcon } from "./tech/dotnet"
import { FastapiIcon } from "./tech/fastapi"
import { GitIcon } from "./tech/git"
import { HtmlIcon } from "./tech/html"
import { JavascriptIcon } from "./tech/javascript"
import { LaravelIcon } from "./tech/laravel"
import { LinuxIcon } from "./tech/linux"
import { MongodbIcon } from "./tech/mongodb"
import { MysqlIcon } from "./tech/mysql"
import { NextjsIcon } from "./tech/nextjs"
import { NginxIcon } from "./tech/nginx"
import { NodejsIcon } from "./tech/nodejs"
import { PhpIcon } from "./tech/php"
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
import type { IconProps } from "./types"

type SvgIconComponent = ComponentType<IconProps>
type IconComponent = LucideIcon | SvgIconComponent

export const iconNames = [
  "api",
  "bot",
  "code",
  "csharp",
  "css",
  "database",
  "dbeaver",
  "discord",
  "docker",
  "dotnet",
  "facebook",
  "fastapi",
  "git",
  "github",
  "gitlab",
  "globe",
  "html",
  "instagram",
  "javascript",
  "laravel",
  "linkedin",
  "linux",
  "mail",
  "mongodb",
  "mysql",
  "nextjs",
  "nginx",
  "nodejs",
  "php",
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
  "whatsapp",
  "x",
  "youtube",
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

export const skillIconNames = iconNames.filter(
  (name) => !socialIconNames.includes(name as (typeof socialIconNames)[number]),
)

export const iconMap: Record<string, IconComponent> = {
  api: Webhook,
  bot: Bot,
  code: Code,
  csharp: CsharpIcon,
  css: CssIcon,
  database: Database,
  dbeaver: DbeaverIcon,
  discord: DiscordIcon,
  docker: DockerIcon,
  dotnet: DotnetIcon,
  facebook: FacebookIcon,
  fastapi: FastapiIcon,
  git: GitIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  globe: Globe,
  html: HtmlIcon,
  instagram: InstagramIcon,
  javascript: JavascriptIcon,
  js: JavascriptIcon,
  laravel: LaravelIcon,
  linkedin: LinkedinIcon,
  linux: LinuxIcon,
  mail: Mail,
  mongo: MongodbIcon,
  mongodb: MongodbIcon,
  mysql: MysqlIcon,
  nextjs: NextjsIcon,
  nginx: NginxIcon,
  nodejs: NodejsIcon,
  php: PhpIcon,
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
  whatsapp: WhatsappIcon,
  x: XIcon,
  youtube: YoutubeIcon,
}
