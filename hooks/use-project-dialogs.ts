"use client";

import { useState } from "react";
import { MockProject, MOCK_PROJECTS, toSlug } from "@/lib/mock-projects";

type DialogKind = "create" | "rename" | "delete" | null;

interface DialogState {
  kind: DialogKind;
  project: MockProject | null;
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS);
  const [dialog, setDialog] = useState<DialogState>({ kind: null, project: null });
  const [loading, setLoading] = useState(false);

  // Form state
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");

  function openCreate() {
    setCreateName("");
    setDialog({ kind: "create", project: null });
  }

  function openRename(project: MockProject) {
    setRenameName(project.name);
    setDialog({ kind: "rename", project });
  }

  function openDelete(project: MockProject) {
    setDialog({ kind: "delete", project });
  }

  function closeDialog() {
    setDialog({ kind: null, project: null });
  }

  function submitCreate() {
    if (!createName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newProject: MockProject = {
        id: String(Date.now()),
        name: createName.trim(),
        slug: toSlug(createName.trim()),
        owned: true,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setProjects((prev) => [newProject, ...prev]);
      setLoading(false);
      closeDialog();
    }, 400);
  }

  function submitRename() {
    if (!renameName.trim() || !dialog.project) return;
    const project = dialog.project;
    setLoading(true);
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, name: renameName.trim(), slug: toSlug(renameName.trim()) }
            : p
        )
      );
      setLoading(false);
      closeDialog();
    }, 400);
  }

  function submitDelete() {
    if (!dialog.project) return;
    const project = dialog.project;
    setLoading(true);
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setLoading(false);
      closeDialog();
    }, 400);
  }

  return {
    projects,
    dialog,
    loading,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
