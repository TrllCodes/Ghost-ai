"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";
import type { Project } from "@/app/generated/prisma/client";

interface EditorHomeClientProps {
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <div className="min-h-screen bg-bg-base">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <main className="pt-12 min-h-[calc(100vh-3rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-medium text-text-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-sm text-text-muted max-w-sm">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button
            onClick={actions.openCreate}
            className="mt-2 gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={actions.dialog.kind === "create"}
        name={actions.createName}
        roomId={actions.roomIdPreview}
        loading={actions.loading}
        onNameChange={actions.setCreateName}
        onSubmit={actions.submitCreate}
        onClose={actions.closeDialog}
      />

      <RenameProjectDialog
        open={actions.dialog.kind === "rename"}
        currentName={actions.dialog.project?.name ?? ""}
        name={actions.renameName}
        loading={actions.loading}
        onNameChange={actions.setRenameName}
        onSubmit={actions.submitRename}
        onClose={actions.closeDialog}
      />

      <DeleteProjectDialog
        open={actions.dialog.kind === "delete"}
        projectName={actions.dialog.project?.name ?? ""}
        loading={actions.loading}
        onSubmit={actions.submitDelete}
        onClose={actions.closeDialog}
      />
    </div>
  );
}
