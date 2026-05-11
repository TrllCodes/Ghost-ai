import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/app/generated/prisma/client";

interface ClerkIdentity {
  userId: string;
  email: string | null;
}

export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

  return { userId, email };
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  email: string | null
): Promise<Project | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  if (project.ownerId === userId) return project;

  if (email) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email } },
    });
    if (collab) return project;
  }

  return null;
}
