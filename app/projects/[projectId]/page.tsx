import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProjectDetail = {
  id: string;
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
  features: string[];
  architecture: string;
  troubleshooting: string;
  retrospective: string;
};

const sections = [
  { id: "features", label: "주요 기능" },
  { id: "architecture", label: "아키텍처" },
  { id: "troubleshooting", label: "트러블슈팅" },
  { id: "retrospective", label: "회고" },
];

function Icon({
  name,
}: {
  name: "github" | "deploy" | "presentation" | "readme" | "external";
}) {
  const paths = {
    github:
      "M12 2.75a9.25 9.25 0 0 0-2.93 18.02c.46.08.63-.2.63-.44v-1.58c-2.56.56-3.1-1.1-3.1-1.1-.42-1.07-1.03-1.36-1.03-1.36-.85-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.83 1.42 2.18 1.01 2.71.77.08-.6.32-1.01.59-1.24-2.05-.23-4.2-1.02-4.2-4.55 0-1.01.36-1.83.95-2.47-.1-.24-.42-1.18.09-2.44 0 0 .78-.25 2.55.94a8.8 8.8 0 0 1 4.64 0c1.77-1.19 2.55-.94 2.55-.94.51 1.26.19 2.2.09 2.44.59.64.95 1.46.95 2.47 0 3.54-2.16 4.32-4.21 4.55.33.29.63.86.63 1.73v2.38c0 .24.17.52.64.43A9.25 9.25 0 0 0 12 2.75Z",
    deploy:
      "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm5.8 7.25h-3.05a12.15 12.15 0 0 0-.87-4.05 6.53 6.53 0 0 1 3.92 4.05Zm-5.8-5.5c.47.68 1.06 2.1 1.2 5.5h-2.4c.14-3.4.73-4.82 1.2-5.5Zm-1.88 1.45a12.15 12.15 0 0 0-.87 4.05H6.2a6.53 6.53 0 0 1 3.92-4.05ZM6.2 12.75h3.05c.06 1.78.35 3.17.87 4.05a6.53 6.53 0 0 1-3.92-4.05Zm5.8 5.5c-.47-.68-1.06-2.1-1.2-5.5h2.4c-.14 3.4-.73 4.82-1.2 5.5Zm1.88-1.45c.52-.88.81-2.27.87-4.05h3.05a6.53 6.53 0 0 1-3.92 4.05Z",
    presentation:
      "M4.75 5.25h14.5v10.5H4.75V5.25Zm2 13.5 3-3m7.5 3-3-3M9 9h6m-6 3h4",
    readme: "M6 4.75h9.5L18 7.25v12H6zM15.5 4.75v3h3M9 11h6M9 14h6M9 17h4",
    external: "M8 8h8v8M16 8l-8 8",
  };
  const filled = name === "github" || name === "deploy";

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        d={paths[name]}
        stroke={filled ? undefined : "currentColor"}
        strokeLinecap={filled ? undefined : "round"}
        strokeLinejoin={filled ? undefined : "round"}
        strokeWidth={filled ? undefined : "1.8"}
      />
    </svg>
  );
}

function ExternalButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: "github" | "deploy" | "presentation" | "readme";
  children: React.ReactNode;
}) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-gray-50"
    >
      <Icon name={icon} />
      {children}
      <span className="text-gray-400">
        <Icon name="external" />
      </span>
    </a>
  );
}

function ContentCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
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
    </section>
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

  if (!response.ok) {
    return null;
  }

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

  if (!project) {
    notFound();
  }

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
                <span>
                  {new Date(project.createdAt).toLocaleDateString("ko-KR")} 등록
                </span>
              </div>
            </div>

            <Link
              href={`/projects/${project.slug}/present`}
              className="inline-flex h-12 w-fit items-center gap-2 rounded-md bg-green-500 px-6 text-sm font-black text-black transition-colors hover:bg-green-400"
            >
              <Icon name="presentation" />
              발표 모드로 보기
            </Link>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          <ExternalButton href={project.githubUrl} icon="github">
            GitHub
          </ExternalButton>
          <ExternalButton href={project.deployUrl} icon="deploy">
            배포
          </ExternalButton>
          <ExternalButton href={project.deckUrl} icon="presentation">
            발표자료
          </ExternalButton>
          <ExternalButton href={project.readmeUrl} icon="readme">
            README
          </ExternalButton>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-black text-black">기술스택</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stacks.map((stack) => (
              <span
                key={stack}
                className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-black"
              >
                {stack}
              </span>
            ))}
          </div>
        </section>

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
            <ContentCard id="overview" title="프로젝트 개요">
              <p>{project.description}</p>
            </ContentCard>

            <ContentCard id="features" title="주요 기능">
              {project.features.length > 0 ? (
                <ul className="space-y-4">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>등록된 주요 기능이 없습니다.</p>
              )}
            </ContentCard>

            <ContentCard id="architecture" title="아키텍처">
              <p>{project.architecture || "등록된 아키텍처 설명이 없습니다."}</p>
            </ContentCard>

            <ContentCard id="troubleshooting" title="트러블슈팅">
              <p>{project.troubleshooting || "등록된 트러블슈팅 내용이 없습니다."}</p>
            </ContentCard>

            <ContentCard id="retrospective" title="회고">
              <p>{project.retrospective || "등록된 회고가 없습니다."}</p>
            </ContentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
