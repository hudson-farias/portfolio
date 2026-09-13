import type { ComponentType } from "react"
import { Bot, Clock, Code, Database, Globe, Mail, Server, Webhook, Workflow, type LucideIcon } from "lucide-react"

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
import { AiohttpIcon } from "./tech/aiohttp"
import { Beautifulsoup4Icon } from "./tech/beautifulsoup4"
import { CeleryIcon } from "./tech/celery"
import { CsharpIcon } from "./tech/csharp"
import { CssIcon } from "./tech/css"
import { CursorIcon } from "./tech/cursor"
import { CypressIcon } from "./tech/cypress"
import { DbeaverIcon } from "./tech/dbeaver"
import { DockerIcon } from "./tech/docker"
import { DotnetIcon } from "./tech/dotnet"
import { FastapiIcon } from "./tech/fastapi"
import { FigmaIcon } from "./tech/figma"
import { GitIcon } from "./tech/git"
import { HtmlIcon } from "./tech/html"
import { HttpxIcon } from "./tech/httpx"
import { InsomniaIcon } from "./tech/insomnia"
import { JavascriptIcon } from "./tech/javascript"
import { JestIcon } from "./tech/jest"
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
import { PydanticIcon } from "./tech/pydantic"
import { PlaywrightIcon } from "./tech/playwright"
import { PostgresqlIcon } from "./tech/postgresql"
import { PostmanIcon } from "./tech/postman"
import { PuppeteerIcon } from "./tech/puppeteer"
import { PytestIcon } from "./tech/pytest"
import { PythonIcon } from "./tech/python"
import { ReactIcon } from "./tech/react"
import { RedisIcon } from "./tech/redis"
import { ScrapyIcon } from "./tech/scrapy"
import { SeleniumIcon } from "./tech/selenium"
import { SqlalchemyIcon } from "./tech/sqlalchemy"
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
  "aiohttp",
  "bot",
  "beautifulsoup4",
  "celery",
  "code",
  "csharp",
  "css",
  "cursor",
  "cronjob",
  "cypress",
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
  "httpx",
  "insomnia",
  "instagram",
  "javascript",
  "jest",
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
  "pydantic",
  "puppeteer",
  "pytest",
  "python",
  "react",
  "redis",
  "scrapy",
  "selenium",
  "server",
  "sqlalchemy",
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
  "aiohttp",
  "beautifulsoup4",
  "celery",
  "cronjob",
  "cypress",
  "dotnet",
  "fastapi",
  "httpx",
  "jest",
  "laravel",
  "nextjs",
  "nodejs",
  "playwright",
  "pydantic",
  "puppeteer",
  "pytest",
  "react",
  "scrapy",
  "selenium",
  "sqlalchemy",
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
  "postman",
  "server",
  "swagger",
  "vscode",
  "vscodium",
  "zsh",
] as const

export const iconMap: Record<string, IconComponent> = {
  aiohttp: AiohttpIcon,
  api: Webhook,
  arch: ArchIcon,
  asdf: AsdfIcon,
  bot: Bot,
  beautifulsoup4: Beautifulsoup4Icon,
  bs4: Beautifulsoup4Icon,
  celery: CeleryIcon,
  code: Code,
  csharp: CsharpIcon,
  css: CssIcon,
  cursor: CursorIcon,
  cronjob: Clock,
  cypress: CypressIcon,
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
  httpx: HttpxIcon,
  insomnia: InsomniaIcon,
  instagram: InstagramIcon,
  javascript: JavascriptIcon,
  jest: JestIcon,
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
  pydantic: PydanticIcon,
  puppeteer: PuppeteerIcon,
  pytest: PytestIcon,
  python: PythonIcon,
  react: ReactIcon,
  redis: RedisIcon,
  scrapy: ScrapyIcon,
  selenium: SeleniumIcon,
  server: Server,
  sqlalchemy: SqlalchemyIcon,
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
