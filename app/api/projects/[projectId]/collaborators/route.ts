import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClerkIdentity, getProjectWithAccess } from "@/lib/project-access";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const identity = await getClerkIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const project = await getProjectWithAccess(projectId, identity.userId, identity.email);
  if (!project) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 });
  }

  const [collaborators, client] = await Promise.all([
    prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    }),
    clerkClient(),
  ]);

  type ClerkInfo = { displayName: string | null; avatarUrl: string | null; email: string };

  const ownerInfoPromise: Promise<ClerkInfo> = client.users
    .getUser(project.ownerId)
    .then((u) => {
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || null;
      const email =
        u.emailAddresses.find((ea) => ea.id === u.primaryEmailAddressId)?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        "";
      return { displayName: name, avatarUrl: u.imageUrl, email };
    })
    .catch(() => ({ displayName: null, avatarUrl: null, email: "" }));

  const clerkMapPromise: Promise<Map<string, { displayName: string | null; avatarUrl: string }>> =
    collaborators.length > 0
      ? client.users
          .getUserList({
            emailAddress: collaborators.map((c) => c.email),
            limit: collaborators.length,
          })
          .then(({ data }) => {
            const map = new Map<string, { displayName: string | null; avatarUrl: string }>();
            for (const u of data) {
              const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || null;
              for (const ea of u.emailAddresses) {
                map.set(ea.emailAddress, { displayName: name, avatarUrl: u.imageUrl });
              }
            }
            return map;
          })
          .catch(() => new Map())
      : Promise.resolve(new Map());

  const [ownerInfo, clerkMap] = await Promise.all([ownerInfoPromise, clerkMapPromise]);

  const members = [
    {
      email: ownerInfo.email,
      displayName: ownerInfo.displayName,
      avatarUrl: ownerInfo.avatarUrl,
      role: "owner" as const,
    },
    ...collaborators.map((c) => {
      const clerk = clerkMap.get(c.email);
      return {
        email: c.email,
        displayName: clerk?.displayName ?? null,
        avatarUrl: clerk?.avatarUrl ?? null,
        role: "collaborator" as const,
      };
    }),
  ];

  return NextResponse.json(members);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email: string | undefined =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    update: {},
    create: { projectId, email },
  });

  return NextResponse.json(collaborator, { status: 201 });
}
