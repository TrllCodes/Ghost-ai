"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RenameProjectDialogProps {
  open: boolean;
  currentName: string;
  name: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function RenameProjectDialog({
  open,
  currentName,
  name,
  loading,
  onNameChange,
  onSubmit,
  onClose,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Renaming &ldquo;{currentName}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <Input
          autoFocus
          placeholder="New project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
          disabled={loading}
        />

        <DialogFooter>
          <Button variant="outline" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!name.trim() || loading}
            className="bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
