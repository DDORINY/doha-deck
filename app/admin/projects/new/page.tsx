import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import NewProjectForm from "./NewProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#0b0b0b] px-6 pt-12">
      <NewProjectForm />
    </div>
  );
}
