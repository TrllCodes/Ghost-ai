"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <div className="min-h-screen bg-bg-base">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        projects={dialogs.projects}
        onNewProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
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
            onClick={dialogs.openCreate}
            className="mt-2 gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialogs.dialog.kind === "create"}
        name={dialogs.createName}
        loading={dialogs.loading}
        onNameChange={dialogs.setCreateName}
        onSubmit={dialogs.submitCreate}
        onClose={dialogs.closeDialog}
      />

      <RenameProjectDialog
        open={dialogs.dialog.kind === "rename"}
        currentName={dialogs.dialog.project?.name ?? ""}
        name={dialogs.renameName}
        loading={dialogs.loading}
        onNameChange={dialogs.setRenameName}
        onSubmit={dialogs.submitRename}
        onClose={dialogs.closeDialog}
      />

      <DeleteProjectDialog
        open={dialogs.dialog.kind === "delete"}
        projectName={dialogs.dialog.project?.name ?? ""}
        loading={dialogs.loading}
        onSubmit={dialogs.submitDelete}
        onClose={dialogs.closeDialog}
      />
    </div>
  );
}
