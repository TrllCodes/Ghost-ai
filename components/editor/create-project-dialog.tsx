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

interface CreateProjectDialogProps {
  open: boolean;
  name: string;
  roomId: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CreateProjectDialog({
  open,
  name,
  roomId,
  loading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            autoFocus
            placeholder="Project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
            disabled={loading}
          />
          {name.trim() && (
            <p className="text-xs text-text-muted">
              Room ID: <span className="text-text-secondary font-mono">{roomId}</span>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!name.trim() || loading}
            className="bg-accent-primary text-bg-base hover:bg-accent-primary/90"
          >
            {loading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
