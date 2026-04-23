"use client";

import { useState } from "react";
import { HeroSection } from "./HeroSection";
import { CategoryRow } from "./CategoryRow";
import { EmbedModal } from "./EmbedModal";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import type { Project } from "@/types/project";

interface CatalogClientProps {
  featured: Project[];
  byCategory: Record<string, Project[]>;
}

export function CatalogClient({ featured, byCategory }: CatalogClientProps) {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);

  return (
    <>
      <HeroSection
        projects={featured}
        onOpen={setOpenProject}
        onDetails={setDetailsProject}
      />

      <div className="pb-16 pt-8">
        {Object.entries(byCategory).map(([category, projects]) => (
          <CategoryRow
            key={category}
            label={category}
            projects={projects}
            onOpen={setOpenProject}
          />
        ))}
      </div>

      <EmbedModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />

      <ProjectDetailsModal
        project={detailsProject}
        onClose={() => setDetailsProject(null)}
      />
    </>
  );
}
