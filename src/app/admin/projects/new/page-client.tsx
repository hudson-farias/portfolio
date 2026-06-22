"use client"

import type { ProjectForm } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import { ProjectsFormClient, type ProjectsFormMode } from "../projects-form-client"

export const ProjectsNewPageClient = ({ mode, gitId, initialForm, frameworks }: { mode: ProjectsFormMode; gitId?: number; initialForm: ProjectForm; frameworks: AdminFramework[] }) => {
  return <ProjectsFormClient mode={mode} gitId={gitId} initialForm={initialForm} frameworks={frameworks} />
}
