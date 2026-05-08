"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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

          <TabsContent value="my-projects" className="flex-1 flex items-center justify-center mt-0 pt-6">
            <p className="text-sm text-text-faint">No projects yet.</p>
          </TabsContent>

          <TabsContent value="shared" className="flex-1 flex items-center justify-center mt-0 pt-6">
            <p className="text-sm text-text-faint">No shared projects.</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-3 border-t border-border-default">
        <Button className="w-full gap-2 bg-accent-primary text-bg-base hover:bg-accent-primary/90">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
