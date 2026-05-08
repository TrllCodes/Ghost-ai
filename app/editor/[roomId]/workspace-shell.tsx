"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Share2, MessageSquare, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/app/generated/prisma/client";

interface WorkspaceShellProps {
  project: Project;
  ownedProjects: Project[];
  sharedProjects: Project[];
  isOwner: boolean;
}

export function WorkspaceShell({ project, ownedProjects, sharedProjects, isOwner }: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <div className="h-screen bg-bg-base flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-12 flex items-center px-3 gap-2 bg-bg-surface border-b border-border-default">
        {/* Left: sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-elevated shrink-0"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          aria-controls="project-sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {/* Center: project name */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-sm font-medium text-text-primary">{project.name}</span>
        </div>

        <div className="flex-1" />

        {/* Right: share, AI sidebar toggle, profile */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShareOpen(true)}
            className="h-8 gap-1.5 text-text-muted hover:text-text-primary hover:bg-bg-elevated px-2.5"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAiSidebarOpen((prev) => !prev)}
            className={`h-8 w-8 hover:bg-bg-elevated ${
              aiSidebarOpen
                ? "text-accent-ai-text bg-accent-ai/10"
                : "text-text-muted hover:text-text-primary"
            }`}
            aria-label={aiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          <div className="w-px h-5 bg-border-default mx-1" />

          <UserButton />
        </div>
      </header>

      {/* Left sidebar */}
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      {/* Body below navbar */}
      <div className="flex flex-1 pt-12 overflow-hidden">
        {/* Canvas area */}
        <main
          className="flex-1 relative bg-bg-base flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Fade vignette over the dot grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-transparent to-bg-base/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/60 via-transparent to-bg-base/60 pointer-events-none" />

          <div className="relative flex flex-col items-center gap-3 text-center px-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-elevated border border-border-default">
              <Sparkles className="h-4 w-4 text-accent-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-text-secondary">Canvas coming soon</p>
              <p className="text-xs text-text-faint max-w-xs">
                The collaborative canvas will appear here. Use the AI sidebar to generate your first architecture.
              </p>
            </div>
          </div>
        </main>

        {/* Right AI sidebar placeholder */}
        {aiSidebarOpen && (
          <aside className="w-80 shrink-0 flex flex-col bg-bg-surface border-l border-border-default">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default">
              <MessageSquare className="h-4 w-4 text-accent-ai-text" />
              <span className="text-sm font-medium text-text-primary">AI Chat</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-elevated border border-border-default">
                <Sparkles className="h-4 w-4 text-accent-ai-text" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-secondary">AI chat coming soon</p>
                <p className="text-xs text-text-faint">
                  Describe your system here and the AI will generate an architecture on the canvas.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Share dialog */}
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        projectId={project.id}
        isOwner={isOwner}
      />

      {/* Project dialogs */}
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
