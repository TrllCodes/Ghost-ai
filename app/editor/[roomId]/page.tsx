import { redirect } from "next/navigation";
import { getClerkIdentity, getProjectWithAccess } from "@/lib/project-access";
import { getEditorProjects } from "@/lib/project-data";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "./workspace-shell";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { roomId } = await params;

  const identity = await getClerkIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getProjectWithAccess(roomId, identity.userId, identity.email);
  if (!project) {
    return <AccessDenied />;
  }

  const { owned, shared } = await getEditorProjects();

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={owned}
      sharedProjects={shared}
      isOwner={project.ownerId === identity.userId}
    />
  );
}
