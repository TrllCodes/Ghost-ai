"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toSlug, buildRoomId } from "@/lib/slug";
import type { Project } from "@/app/generated/prisma/client";

type DialogKind = "create" | "rename" | "delete" | null;

interface DialogState {
  kind: DialogKind;
  project: Project | null;
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ kind: null, project: null });
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [suffix, setSuffix] = useState("");

  const roomIdPreview = buildRoomId(createName.trim() || "", suffix);

  function openCreate() {
    setCreateName("");
    setSuffix(Math.random().toString(36).slice(2, 8));
    setDialog({ kind: "create", project: null });
  }

  function openRename(project: Project) {
    setRenameName(project.name);
    setDialog({ kind: "rename", project });
  }

  function openDelete(project: Project) {
    setDialog({ kind: "delete", project });
  }

  function closeDialog() {
    setDialog({ kind: null, project: null });
  }

  async function submitCreate() {
    const name = createName.trim();
    if (!name) return;
    const id = buildRoomId(toSlug(name) || "project", suffix);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const project: Project = await res.json();
      closeDialog();
      router.push(`/editor/${project.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitRename() {
    const name = renameName.trim();
    if (!name || !dialog.project) return;
    const project = dialog.project;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      closeDialog();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitDelete() {
    if (!dialog.project) return;
    const project = dialog.project;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      closeDialog();
      if (pathname === `/editor/${project.id}`) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    dialog,
    loading,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    roomIdPreview,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
