/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProjectDetail = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  stacks: string[];
  githubUrl: string;
  deployUrl: string;
  deckUrl: string;
  readmeUrl: string;
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

const sections = [
  { id: "overview", label: "프로젝트 개요" },
  { id: "features", label: "주요 기능" },
  { id: "stacks", label: "기술스택" },
  { id: "architecture", label: "아키텍처" },
  { id: "code-review", label: "코드리뷰" },
  { id: "troubleshooting", label: "트러블슈팅" },
  { id: "retrospective", label: "회고" },
];

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-11 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-gray-50"
    >
      {children}
    </a>
  );
}

function SectionImage({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;

  return (
    <figure className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <img src={src} alt={alt} className="h-auto w-full object-cover" />
    </figure>
  );
}

function ContentCard({
  id,
  title,
  imageUrl = "",
  children,
}: {
  id: string;
  title: string;
  imageUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10"
    >
      <h2 className="text-2xl font-black text-black sm:text-3xl">{title}</h2>
      <div className="mt-7 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
        {children}
      </div>
      <SectionImage src={imageUrl} alt={`${title} 이미지`} />
    </section>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-black text-black">{title}</h3>
      <ul className="mt-4 space-y-4">
        {items.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getProject(projectId: string) {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${protocol}://${host}/api/projects/${projectId}`, {
    cache: "no-store",
    headers: { cookie: headerStore.get("cookie") ?? "" },
  });

  if (!response.ok) return null;

  const result = (await response.json()) as { project: ProjectDetail };
  return result.project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) notFound();

  return (
    <div className="bg-white px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-2xl bg-gray-50 px-7 py-10 sm:px-14 sm:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-normal text-black sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-700">
                {project.summary}
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black">
                  {project.visibility === "PUBLIC" ? "공개" : "비공개"}
                </span>
                <span>{new Date(project.createdAt).toLocaleDateString("ko-KR")} 등록</span>
              </div>
            </div>

            <Link
              href={`/projects/${project.slug}/present`}
              className="inline-flex h-12 w-fit items-center rounded-md bg-green-500 px-6 text-sm font-black text-black transition-colors hover:bg-green-400"
            >
              발표 모드로 보기
            </Link>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <ExternalButton href={project.githubUrl}>GitHub</ExternalButton>
          <ExternalButton href={project.deployUrl}>배포</ExternalButton>
          <ExternalButton href={project.deckUrl}>발표자료</ExternalButton>
          <ExternalButton href={project.readmeUrl}>README</ExternalButton>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-xl border border-gray-200 bg-white p-7">
              <h2 className="text-sm font-black text-black">섹션</h2>
              <div className="mt-6 flex flex-col gap-5 text-sm text-gray-700">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="hover:text-black">
                    {section.label}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <div className="space-y-8">
            <ContentCard id="overview" title="프로젝트 개요" imageUrl={project.overviewImageUrl}>
              <p className="whitespace-pre-line">{project.description}</p>
            </ContentCard>

            <ContentCard id="features" title="주요 기능" imageUrl={project.featuresImageUrl}>
              {project.basicFeatures.length || project.advancedFeatures.length ? (
                <div className="space-y-8">
                  <FeatureList title="기본 기능" items={project.basicFeatures} />
                  <FeatureList title="고도화 기능" items={project.advancedFeatures} />
                </div>
              ) : (
                <p>등록된 주요 기능이 없습니다.</p>
              )}
            </ContentCard>

            <ContentCard id="stacks" title="기술스택" imageUrl={project.stacksImageUrl}>
              <div className="flex flex-wrap gap-2">
                {project.stacks.map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-black"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </ContentCard>

            <ContentCard id="architecture" title="아키텍처" imageUrl={project.architectureImageUrl}>
              <p className="whitespace-pre-line">
                {project.architecture || "등록된 아키텍처 설명이 없습니다."}
              </p>
            </ContentCard>

            <ContentCard id="code-review" title="코드리뷰" imageUrl={project.codeReviewImageUrl}>
              <p className="whitespace-pre-line">
                {project.codeReview || "등록된 코드리뷰 내용이 없습니다."}
              </p>
            </ContentCard>

            <ContentCard
              id="troubleshooting"
              title="트러블슈팅"
              imageUrl={project.troubleshootingImageUrl}
            >
              <p className="whitespace-pre-line">
                {project.troubleshooting || "등록된 트러블슈팅 내용이 없습니다."}
              </p>
            </ContentCard>

            <ContentCard id="retrospective" title="회고" imageUrl={project.retrospectiveImageUrl}>
              <p className="whitespace-pre-line">
                {project.retrospective || "등록된 회고가 없습니다."}
              </p>
            </ContentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
