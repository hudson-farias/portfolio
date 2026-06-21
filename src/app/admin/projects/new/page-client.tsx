"use client"

import type { ProjectForm } from "../interfaces"
import { ProjectsFormClient, type ProjectsFormMode } from "../projects-form-client"

export const ProjectsNewPageClient = ({ mode, gitId, initialForm }: { mode: ProjectsFormMode; gitId?: number; initialForm: ProjectForm }) => {
  return <ProjectsFormClient mode={mode} gitId={gitId} initialForm={initialForm} />
}
