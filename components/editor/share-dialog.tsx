"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, UserX, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MemberInfo {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "collaborator";
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

function MemberAvatar({ info }: { info: MemberInfo }) {
  const initial = (info.displayName ?? info.email ?? "?")[0]?.toUpperCase() ?? "?";
  if (info.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={info.avatarUrl}
        alt={info.displayName ?? info.email}
        className="h-7 w-7 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="h-7 w-7 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-text-secondary">{initial}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: "owner" | "collaborator" }) {
  if (role === "owner") {
    return (
      <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-accent-primary-dim text-accent-primary">
        Owner
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-bg-subtle text-text-muted">
      Collaborator
    </span>
  );
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<MemberInfo[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data: MemberInfo[] = await res.json();
        setCollaborators(data);
      }
    } finally {
      setLoadingList(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!open) return;
    setInviteEmail("");
    setInviteError(null);
    fetchCollaborators();
  }, [open, fetchCollaborators]);

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setInviteError("Enter a valid email address");
      return;
    }
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setInviteEmail("");
        await fetchCollaborators();
      } else {
        const data = await res.json().catch(() => ({}));
        setInviteError((data as { error?: string }).error ?? "Failed to invite");
      }
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchCollaborators();
      }
    } finally {
      setRemovingEmail(null);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent showCloseButton className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Copy link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="w-full justify-start gap-2 text-text-secondary hover:text-text-primary"
          >
            {copied ? (
              <Check className="h-4 w-4 text-state-success" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy project link"}
          </Button>

          {/* Invite section — owner only */}
          {isOwner && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                Invite by email
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="colleague@company.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError(null);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
                  disabled={inviting}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="shrink-0 bg-accent-primary text-bg-base hover:bg-accent-primary/90"
                  aria-label="Invite collaborator"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              {inviteError && (
                <p className="text-xs text-state-error">{inviteError}</p>
              )}
            </div>
          )}

          {/* Members list */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              People with access
            </p>
            {loadingList ? (
              <p className="text-sm text-text-faint py-2">Loading…</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {collaborators.map((member) => (
                  <li
                    key={member.email || member.role}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-bg-elevated"
                  >
                    <MemberAvatar info={member} />
                    <div className="flex-1 min-w-0">
                      {member.displayName && (
                        <p className="text-sm text-text-primary leading-tight truncate">
                          {member.displayName}
                        </p>
                      )}
                      {member.email && (
                        <p
                          className={`truncate ${
                            member.displayName
                              ? "text-xs text-text-muted"
                              : "text-sm text-text-secondary"
                          }`}
                        >
                          {member.email}
                        </p>
                      )}
                    </div>
                    <RoleBadge role={member.role} />
                    {isOwner && member.role === "collaborator" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(member.email)}
                        disabled={removingEmail === member.email}
                        className="h-7 w-7 text-text-faint hover:text-state-error hover:bg-state-error/10 shrink-0"
                        aria-label={`Remove ${member.email}`}
                      >
                        <UserX className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
