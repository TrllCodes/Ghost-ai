import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/app/generated/prisma/client";

export async function getEditorProjects(): Promise<{
  owned: Project[];
  shared: Project[];
}> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const [owned, user] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    currentUser(),
  ]);

  const email = user?.emailAddresses?.[0]?.emailAddress;
  let shared: Project[] = [];

  if (email) {
    const collabs = await prisma.projectCollaborator.findMany({
      where: { email },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
    shared = collabs.map((c) => c.project);
  }

  return { owned, shared };
}
