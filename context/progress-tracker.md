# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Frontend — Editor Home Wired to Real API (complete)

## Current Goal

- Editor home is fully wired to the real project API. Next: canvas setup (Liveblocks + React Flow).

## Completed

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

- Canvas setup (Liveblocks + React Flow).

## Open Questions

- **Accelerate branch in `lib/prisma.ts`**: the `prisma+postgres://` code path throws at runtime. If the deployment URL ever switches to Accelerate, `@prisma/extension-accelerate` must be installed and that branch implemented before deploy.
- **Collaborator identity**: `ProjectCollaborator` stores email, but Clerk identifies users by ID. The email-to-Clerk-user lookup strategy (e.g. Clerk Backend API) hasn't been decided yet. Currently `getEditorProjects()` resolves shared projects by matching the user's primary email against `ProjectCollaborator.email`.

## Architecture Decisions

- Dark-only: all CSS custom properties set in `:root` (no light/dark split). The `dark` class on `<html>` activates shadcn's `dark:` utility variants.
- shadcn tokens (`--background`, `--foreground`, etc.) are mapped to our design system colors so shadcn components inherit the correct dark theme without modification.
- Clerk theming: `@clerk/ui` `dark` theme as base; appearance variables reference CSS custom properties (no hardcoded values).
- In Next.js 16, `proxy.ts` replaces `middleware.ts` for request interception.
- Room ID = project ID: the client generates `{slug}-{suffix}` before calling POST and passes it as the project `id`, so the Liveblocks room ID and database project ID are the same value from creation.

## Session Notes

- The Prisma client output is at `app/generated/prisma` — import from `@/app/generated/prisma/client`, not from `@prisma/client`.
- API routes use `auth()` from `@clerk/nextjs/server` to get `userId`; `params` in dynamic routes must be awaited (`await params`) per Next.js 16 conventions.
- `prisma.config.ts` reads `DATABASE_URL` via `dotenv/config` (loads `.env`). The same value must exist in `.env.local` for Next.js runtime and in `.env` for Prisma CLI commands.
- `app/editor/page.tsx` is a server component — do not add `"use client"`. The interactive shell lives in `app/editor/editor-home-client.tsx`.
