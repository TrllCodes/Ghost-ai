export interface MockProject {
  id: string;
  name: string;
  slug: string;
  owned: boolean;
  updatedAt: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "E-commerce Platform", slug: "e-commerce-platform", owned: true, updatedAt: "2026-05-06" },
  { id: "2", name: "Mobile Banking App", slug: "mobile-banking-app", owned: true, updatedAt: "2026-05-04" },
  { id: "3", name: "Team Wiki", slug: "team-wiki", owned: false, updatedAt: "2026-05-01" },
];

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
