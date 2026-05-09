import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import EditProjectForm, { EditableProject } from "./EditProjectForm";

export const dynamic = "force-dynamic";

async function getProject(projectId: string) {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${protocol}://${host}/api/projects/${projectId}`, {
    cache: "no-store",
    headers: { cookie: headerStore.get("cookie") ?? "" },
  });

  if (response.status === 401) {
    redirect("/admin/login");
  }

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as { project: EditableProject };
  return result.project;
}

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#0b0b0b] px-6 pt-12">
      <EditProjectForm project={project} />
    </div>
  );
}
