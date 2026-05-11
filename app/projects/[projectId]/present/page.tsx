import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PresentationMode from "./PresentationMode";

export const dynamic = "force-dynamic";

type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stacks: string[];
  deployUrl: string;
  demoYoutubeUrl: string;
  demoFileUrl: string;
  demoFileName: string;
  demoFileType: string;
  demoFileSize: number | null;
  basicFeatures: string[];
  advancedFeatures: string[];
  architecture: string;
  codeReview: string;
  troubleshooting: string;
  retrospective: string;
  overviewImageUrl: string;
  stacksImageUrl: string;
  featuresImageUrl: string;
  architectureImageUrl: string;
  codeReviewImageUrl: string;
  troubleshootingImageUrl: string;
  retrospectiveImageUrl: string;
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
        deployUrl: project.deployUrl,
        demoYoutubeUrl: project.demoYoutubeUrl,
        demoFileUrl: project.demoFileUrl,
        demoFileName: project.demoFileName,
        demoFileType: project.demoFileType,
        demoFileSize: project.demoFileSize,
        slides: [
          {
            title: "프로젝트 개요",
            body: project.description,
            imageUrl: project.overviewImageUrl,
          },
          {
            title: "주요 기능",
            body: "프로젝트의 기본 기능과 고도화 기능을 정리했습니다.",
            groups: [
              { title: "기본 기능", points: project.basicFeatures },
              { title: "고도화 기능", points: project.advancedFeatures },
            ],
            imageUrl: project.featuresImageUrl,
          },
          {
            title: "기술스택",
            body: "프로젝트 구현에 사용한 기술입니다.",
            points: project.stacks,
            imageUrl: project.stacksImageUrl,
          },
          {
            title: "아키텍처",
            body: project.architecture || "등록된 아키텍처 설명이 없습니다.",
            imageUrl: project.architectureImageUrl,
          },
          {
            title: "코드리뷰",
            body: project.codeReview || "등록된 코드리뷰 내용이 없습니다.",
            imageUrl: project.codeReviewImageUrl,
          },
          {
            title: "시연 자료",
            body: "프로젝트를 직접 확인할 수 있는 자료입니다.",
          },
          {
            title: "트러블슈팅",
            body: project.troubleshooting || "등록된 트러블슈팅 내용이 없습니다.",
            imageUrl: project.troubleshootingImageUrl,
          },
          {
            title: "회고",
            body: project.retrospective || "등록된 회고가 없습니다.",
            imageUrl: project.retrospectiveImageUrl,
          },
        ],
      }}
    />
  );
}
