# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Data — Prisma Setup (complete; awaiting next spec)

## Current Goal

- All five specs implemented. Next session should begin with the next feature spec once written.

## Completed

- **Prisma Setup (05-prisma)**
  - `prisma/models/project.prisma` — `ProjectStatus` enum (`DRAFT`, `ARCHIVED`); `Project` model (ownerId, name, description?, status, canvasJsonPath?, timestamps, indexes on ownerId and createdAt); `ProjectCollaborator` model (projectId, email, createdAt, cascade-delete relation, unique on project/email, indexes on email and project/date)
  - `lib/prisma.ts` — cached singleton; branches on `DATABASE_URL`: `prisma+postgres://` path throws with install instructions; direct `postgres://` path uses `PrismaPg` adapter; global cache in development for hot-reload safety
  - Migration `20260508043645_init_projects` applied to Prisma Postgres database
  - `npx prisma generate` produced client at `app/generated/prisma`
  - `npm run build` passes

- **Project Dialogs (04-project-dialogs)**
  - `lib/mock-projects.ts` — `MockProject` interface, `MOCK_PROJECTS` seed data, `toSlug()` helper
  - `hooks/use-project-dialogs.ts` — manages dialog kind, target project, form values, loading state, and mock CRUD mutations
  - `components/editor/create-project-dialog.tsx` — name input with live slug preview; Enter submits
  - `components/editor/rename-project-dialog.tsx` — prefilled name input; current name in description; Enter submits; auto-focuses
  - `components/editor/delete-project-dialog.tsx` — destructive confirm; no input; error-styled confirm button
  - `app/editor/page.tsx` — centered home screen (heading + description + New Project button); all three dialogs mounted; wired to `useProjectDialogs`
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

- No spec written yet. Expected next areas based on architecture context: API routes for project CRUD (`app/api/projects/`), replacing mock project data in `lib/mock-projects.ts` and `hooks/use-project-dialogs.ts` with real Prisma queries, and canvas setup (Liveblocks + React Flow).

## Open Questions

- **Accelerate branch in `lib/prisma.ts`**: the `prisma+postgres://` code path throws at runtime. If the deployment URL ever switches to Accelerate, `@prisma/extension-accelerate` must be installed and that branch implemented before deploy.
- **Mock data teardown**: `lib/mock-projects.ts` and `hooks/use-project-dialogs.ts` use in-memory mock state. These need to be replaced with real API calls once project CRUD routes exist. The mock layer should be removed entirely, not left alongside real data.
- **Collaborator identity**: `ProjectCollaborator` stores email, but Clerk identifies users by ID. The email-to-Clerk-user lookup strategy (e.g. Clerk Backend API) hasn't been decided yet.

## Architecture Decisions

- Dark-only: all CSS custom properties set in `:root` (no light/dark split). The `dark` class on `<html>` activates shadcn's `dark:` utility variants.
- shadcn tokens (`--background`, `--foreground`, etc.) are mapped to our design system colors so shadcn components inherit the correct dark theme without modification.
- Clerk theming: `@clerk/ui` `dark` theme as base; appearance variables reference CSS custom properties (no hardcoded values).
- In Next.js 16, `proxy.ts` replaces `middleware.ts` for request interception.

## Session Notes

- The Prisma client output is at `app/generated/prisma` — import from `../app/generated/prisma/client`, not from `@prisma/client`.
- `prisma.config.ts` reads `DATABASE_URL` via `dotenv/config` (loads `.env`). The same value must exist in `.env.local` for Next.js runtime and in `.env` for Prisma CLI commands.
