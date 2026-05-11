# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Frontend — Share Dialog (complete)

## Current Goal

- Share dialog is fully implemented. Next: canvas setup (Liveblocks + React Flow).

## Completed

- **Share Dialog (09-share-dialog)**
  - `app/api/projects/[projectId]/collaborators/route.ts` — `GET` returns enriched collaborator list (Clerk `displayName` + `avatarUrl`, falls back to email-only); access requires owner or collaborator membership; `POST` invites a collaborator by email (owner only), upsert prevents duplicates
  - `app/api/projects/[projectId]/collaborators/[collaboratorEmail]/route.ts` — `DELETE` removes a collaborator by URL-decoded email (owner only)
  - `components/editor/share-dialog.tsx` — `ShareDialog` client component; fetches and renders collaborator list on open; owners can invite by email and remove collaborators; collaborators see read-only list; copy-link button writes `window.location.href` with temporary "Copied!" feedback; avatars load from Clerk, fall back to initial-letter placeholder
  - `app/editor/[roomId]/workspace-shell.tsx` — added `isOwner: boolean` prop; Share button now opens `ShareDialog`; `ShareDialog` rendered alongside project dialogs
  - `app/editor/[roomId]/page.tsx` — passes `isOwner={project.ownerId === identity.userId}` to `WorkspaceShell`
  - `npm run build` passes

- **Editor Workspace Shell (08-editor-workspace-shell)**
  - `lib/project-access.ts` — `getClerkIdentity()` returns `{ userId, email }` from Clerk; `getProjectWithAccess(projectId, userId, email)` checks project ownership or collaborator membership and returns the project or `null`
  - `components/editor/access-denied.tsx` — centered layout with lock icon, short message, and link back to `/editor`; used for missing or unauthorized projects
  - `components/editor/project-sidebar.tsx` — added optional `activeProjectId?: string` prop; active project item highlighted with `bg-bg-elevated` and bold text
  - `app/editor/[roomId]/page.tsx` — async server component; unauthenticated users redirect to `/sign-in`; missing or unauthorized projects render `AccessDenied`; authorized users receive the full workspace
  - `app/editor/[roomId]/workspace-shell.tsx` — client shell managing sidebar and AI sidebar toggle state; navbar shows project name, share button (placeholder), and AI sidebar toggle; `ProjectSidebar` rendered with current room highlighted; canvas placeholder with dark background and centered message; right sidebar placeholder for AI chat
  - `npm run build` passes

- **Wire Editor Home (07-wire-editor-home)**
  - `lib/slug.ts` — `toSlug()` helper (moved from deleted `lib/mock-projects.ts`); `buildRoomId(name, suffix)` produces `{slug}-{suffix}` room ID
  - `lib/project-data.ts` — `getEditorProjects()` server-side helper: fetches owned projects by `ownerId` and shared projects via `ProjectCollaborator.email` lookup using `currentUser()` from Clerk
  - `app/api/projects/route.ts` — POST now accepts optional `id` in body so the client-computed room ID becomes the project ID (project ID and Liveblocks room ID stay aligned)
  - `hooks/use-project-actions.ts` — replaces `use-project-dialogs.ts`; manages dialog state + real API calls; create generates `{slug}-{suffix}` room ID, calls POST, navigates to `/editor/{project.id}`; rename calls PATCH then `router.refresh()`; delete calls DELETE, redirects to `/editor` if deleting active workspace else `router.refresh()`
  - `app/editor/page.tsx` — converted to async server component; fetches owned + shared projects via `getEditorProjects()` and passes them to `EditorHomeClient`
  - `app/editor/editor-home-client.tsx` — new client shell component; receives `ownedProjects` and `sharedProjects` as props; mounts sidebar, dialogs, and wires to `useProjectActions`
  - `components/editor/project-sidebar.tsx` — updated to accept `ownedProjects: Project[]` and `sharedProjects: Project[]` (separate lists); uses real Prisma `Project` type; removed `MockProject` dependency
  - `components/editor/create-project-dialog.tsx` — accepts `roomId: string` prop from hook; shows room ID preview; removed `toSlug` import from deleted mock module
  - `lib/mock-projects.ts` — deleted
  - `hooks/use-project-dialogs.ts` — deleted
  - `npm run build` passes

- **Project API Routes (06-project-apis)**
  - `app/api/projects/route.ts` — `GET` returns all projects owned by the authenticated user; `POST` creates a project (defaults name to `Untitled Project`); both return `401` for unauthenticated requests
  - `app/api/projects/[projectId]/route.ts` — `PATCH` renames a project (requires `name` in body); `DELETE` removes a project; both return `401` for unauthenticated, `403` for non-owner, `404` if project not found
  - `lib/prisma.ts` — fixed pre-existing TypeScript error: `url` narrowing now explicit via `const url: string = rawUrl` after null guard
  - `npm run build` passes

- **Prisma Setup (05-prisma)**
  - `prisma/models/project.prisma` — `ProjectStatus` enum (`DRAFT`, `ARCHIVED`); `Project` model (ownerId, name, description?, status, canvasJsonPath?, timestamps, indexes on ownerId and createdAt); `ProjectCollaborator` model (projectId, email, createdAt, cascade-delete relation, unique on project/email, indexes on email and project/date)
  - `lib/prisma.ts` — cached singleton; branches on `DATABASE_URL`: `prisma+postgres://` path throws with install instructions; direct `postgres://` path uses `PrismaPg` adapter; global cache in development for hot-reload safety
  - Migration `20260508043645_init_projects` applied to Prisma Postgres database
  - `npx prisma generate` produced client at `app/generated/prisma`
  - `npm run build` passes

- **Project Dialogs (04-project-dialogs)**
  - `components/editor/create-project-dialog.tsx` — name input with live room ID preview; Enter submits
  - `components/editor/rename-project-dialog.tsx` — prefilled name input; current name in description; Enter submits; auto-focuses
  - `components/editor/delete-project-dialog.tsx` — destructive confirm; no input; error-styled confirm button
  - `components/editor/project-sidebar.tsx` — project list with rename/delete actions on owned items (hidden on shared); mobile backdrop scrim + tap-outside-to-close; New Project button wired
  - `npm run build` passes

- **Auth (03-auth)**
  - `@clerk/ui` installed (v1.9.0) for bundled UI and `dark` theme
  - `proxy.ts` at project root — `clerkMiddleware` with `createRouteMatcher`; all routes protected except `/sign-in(.*)` and `/sign-up(.*)`
  - `app/layout.tsx` — `ClerkProvider` wraps root with `ui={ui}` and `appearance={{ theme: dark, variables: {...} }}` using CSS custom property references (no hardcoded colors)
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (left: logo + tagline + feature list on `lg:`; right: `<SignIn />`)
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel structure with `<SignUp />`
  - `app/page.tsx` — server component; redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - `app/editor/page.tsx` — editor content moved from `app/page.tsx`
  - `components/editor/editor-navbar.tsx` — `UserButton` added to right section
  - Clerk env vars added: `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
  - `npm run build` passes

- **Editor chrome (02-editor)**
  - `components/editor/editor-navbar.tsx` — fixed-height navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose
  - `components/editor/project-sidebar.tsx` — floating overlay sidebar, Tabs (My Projects / Shared), New Project button
  - `app/page.tsx` wired up with sidebar open state; `npm run build` passes

- **Design system and UI primitives (01-design-system)**
  - shadcn/ui installed and configured (Tailwind v4)
  - Components added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - `lib/utils.ts` created with `cn()` helper (clsx + tailwind-merge)
  - `globals.css` configured with full dark design system tokens
  - shadcn tokens mapped to project design system in `:root`
  - `layout.tsx` has `dark` class on `<html>` for class-based dark mode
  - lucide-react confirmed installed
  - `npm run build` passes

## In Progress

- None.

## Next Up

- Canvas setup (Liveblocks + React Flow) — wire up Liveblocks room token issuance and React Flow canvas inside `/editor/[roomId]`.



## Open Questions

- **Accelerate branch in `lib/prisma.ts`**: the `prisma+postgres://` code path throws at runtime. If the deployment URL ever switches to Accelerate, `@prisma/extension-accelerate` must be installed and that branch implemented before deploy.

## Architecture Decisions

- Dark-only: all CSS custom properties set in `:root` (no light/dark split). The `dark` class on `<html>` activates shadcn's `dark:` utility variants.
- shadcn tokens (`--background`, `--foreground`, etc.) are mapped to our design system colors so shadcn components inherit the correct dark theme without modification.
- Clerk theming: `@clerk/ui` `dark` theme as base; appearance variables reference CSS custom properties (no hardcoded values).
- In Next.js 16, `proxy.ts` replaces `middleware.ts` for request interception.
- Room ID = project ID: the client generates `{slug}-{suffix}` before calling POST and passes it as the project `id`, so the Liveblocks room ID and database project ID are the same value from creation.

## Session Notes

- Collaborator identity resolved: `ProjectCollaborator` stores email; `GET /api/projects/[projectId]/collaborators` enriches each email via `clerkClient().users.getUserList({ emailAddress: [...] })` in a single batched call. Falls back to email-only if Clerk lookup fails or returns no match.
- The Prisma client output is at `app/generated/prisma` — import from `@/app/generated/prisma/client`, not from `@prisma/client`.
- API routes use `auth()` from `@clerk/nextjs/server` to get `userId`; `params` in dynamic routes must be awaited (`await params`) per Next.js 16 conventions.
- `prisma.config.ts` reads `DATABASE_URL` via `dotenv/config` (loads `.env`). The same value must exist in `.env.local` for Next.js runtime and in `.env` for Prisma CLI commands.
- `app/editor/page.tsx` is a server component — do not add `"use client"`. The interactive shell lives in `app/editor/editor-home-client.tsx`.
