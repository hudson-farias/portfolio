"use client"

import type { ProjectForm } from "../interfaces"
import { ProjectsFormClient } from "../projects-form-client"

export const ProjectsEditPageClient = ({ gitId, initialForm }: { gitId: number; initialForm: ProjectForm }) => {
  return <ProjectsFormClient mode="edit" gitId={gitId} initialForm={initialForm} />
}
