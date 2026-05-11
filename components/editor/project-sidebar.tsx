"use client";

import Link from "next/link";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/app/generated/prisma/client";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: Project[];
  sharedProjects: Project[];
  activeProjectId?: string;
  onNewProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

interface ProjectItemProps {
  project: Project;
  owned: boolean;
  active: boolean;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectItem({ project, owned, active, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className={`group flex items-center justify-between rounded-sm px-2 py-1.5 hover:bg-bg-elevated ${active ? "bg-bg-elevated" : ""}`}>
      <Link
        href={`/editor/${project.id}`}
        className={`flex-1 text-sm truncate min-w-0 ${active ? "text-text-primary font-medium" : "text-text-secondary"}`}
      >
        {project.name}
      </Link>
      {owned && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-text-muted hover:text-text-primary hover:bg-bg-subtle"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename(project)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-text-muted hover:text-state-error hover:bg-bg-subtle"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete(project)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 sm:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <div
        id="project-sidebar"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed top-12 left-0 bottom-0 z-30 w-72 flex flex-col bg-bg-surface border-r border-border-default transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-medium text-text-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-text-muted hover:text-text-primary hover:bg-bg-elevated"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col px-3 pt-3">
          <Tabs defaultValue="my-projects" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="w-full bg-bg-elevated">
              <TabsTrigger value="my-projects" className="flex-1 text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto mt-0 pt-2">
              {ownedProjects.length === 0 ? (
                <div className="flex items-center justify-center pt-6">
                  <p className="text-sm text-text-faint">No projects yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      owned={true}
                      active={activeProjectId === project.id}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto mt-0 pt-2">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center pt-6">
                  <p className="text-sm text-text-faint">No shared projects.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      owned={false}
                      active={activeProjectId === project.id}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-3 border-t border-border-default">
          <Button
            onClick={onNewProject}
            className="w-full gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </>
  );
}
