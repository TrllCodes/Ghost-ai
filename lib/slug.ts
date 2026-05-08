export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildRoomId(name: string, suffix: string): string {
  const slug = toSlug(name) || "project";
  return `${slug}-${suffix}`;
}
