import { getEditorProjects } from "@/lib/project-data";
import { EditorHomeClient } from "./editor-home-client";

export default async function EditorPage() {
  const { owned, shared } = await getEditorProjects();
  return <EditorHomeClient ownedProjects={owned} sharedProjects={shared} />;
}
