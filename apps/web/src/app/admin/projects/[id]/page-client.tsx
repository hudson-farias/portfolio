"use client"

import type { ProjectForm } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import { ProjectsFormClient } from "../projects-form-client"

export const ProjectsEditPageClient = ({ gitId, initialForm, frameworks }: { gitId: number; initialForm: ProjectForm; frameworks: AdminFramework[] }) => {
  return <ProjectsFormClient mode="edit" gitId={gitId} initialForm={initialForm} frameworks={frameworks} />
}
