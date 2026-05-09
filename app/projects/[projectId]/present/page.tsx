import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PresentationMode from "./PresentationMode";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  stacks: string[];
  deckUrl: string;
  features: string[];
  architecture: string;
  troubleshooting: string;
  retrospective: string;
};

async function getProject(projectId: string) {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${protocol}://${host}/api/projects/${projectId}`, {
    cache: "no-store",
    headers: { cookie: headerStore.get("cookie") ?? "" },
  });

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as { project: Project };
  return result.project;
}

export default async function ProjectPresentationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <PresentationMode
      project={{
        id: project.slug,
        title: project.title,
        subtitle: project.summary,
        youtubeUrl: "",
        slides: [
          { title: "프로젝트 개요", body: project.description },
          {
            title: "주요 기능",
            body: "프로젝트의 핵심 기능을 정리했습니다.",
            points: project.features,
          },
          {
            title: "기술스택",
            body: "프로젝트 구현에 사용한 기술입니다.",
            points: project.stacks,
          },
          { title: "아키텍처", body: project.architecture || "등록된 아키텍처 설명이 없습니다." },
          {
            title: "시연 자료",
            body: project.deckUrl
              ? "등록된 발표자료 링크를 상세 페이지에서 확인할 수 있습니다."
              : "등록된 발표자료 링크가 없습니다.",
          },
          {
            title: "트러블슈팅",
            body: project.troubleshooting || "등록된 트러블슈팅 내용이 없습니다.",
          },
          { title: "회고", body: project.retrospective || "등록된 회고가 없습니다." },
        ],
      }}
    />
  );
}
