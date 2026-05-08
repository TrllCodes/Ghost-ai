# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- UI — Project Dialogs

## Current Goal

- None.

## Completed

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

- None.

## Open Questions

- None.

## Architecture Decisions

- Dark-only: all CSS custom properties set in `:root` (no light/dark split). The `dark` class on `<html>` activates shadcn's `dark:` utility variants.
- shadcn tokens (`--background`, `--foreground`, etc.) are mapped to our design system colors so shadcn components inherit the correct dark theme without modification.
- Clerk theming: `@clerk/ui` `dark` theme as base; appearance variables reference CSS custom properties (no hardcoded values).
- In Next.js 16, `proxy.ts` replaces `middleware.ts` for request interception.

## Session Notes

- Add context needed to resume work in the next session.
