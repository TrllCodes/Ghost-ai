import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-bg-elevated border border-border-default">
          <Lock className="h-5 w-5 text-text-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-text-primary">Access Denied</h1>
          <p className="text-sm text-text-muted max-w-xs">
            This project doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
        <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
