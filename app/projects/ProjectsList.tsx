"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  stacks: string[];
  githubUrl: string;
  deployUrl: string;
};

function ProjectPreview() {
  return (
    <div className="relative flex h-full items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f6f7f4,#d9ddda)] px-10 pb-7">
      <div className="relative h-28 w-56 rounded-t-lg border-4 border-gray-500 bg-white shadow-xl blur-[1px]">
        <div className="grid h-full grid-cols-[48px_1fr] gap-3 p-3">
          <div className="space-y-2 border-r border-gray-100 pr-2">
            <div className="h-2 rounded bg-gray-200" />
            <div className="h-1.5 rounded bg-gray-100" />
            <div className="h-1.5 rounded bg-gray-100" />
            <div className="h-1.5 rounded bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border bg-gray-50" />
            <div className="rounded border bg-gray-50" />
            <div className="rounded border bg-gray-50" />
            <div className="rounded border bg-gray-50" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 h-3 w-72 rounded-b-2xl bg-gray-300" />
    </div>
  );
}

function ProjectThumbnail({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ProjectPreview />;
  }

  return (
    <Image
      src={src}
      alt={`${title} 썸네일`}
      fill
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      unoptimized
      onError={() => setFailed(true)}
      className="h-full w-full bg-gray-100 object-cover"
    />
  );
}

function Icon({ name }: { name: "github" | "deploy" | "presentation" }) {
  const paths = {
    github:
      "M12 2.75a9.25 9.25 0 0 0-2.93 18.02c.46.08.63-.2.63-.44v-1.58c-2.56.56-3.1-1.1-3.1-1.1-.42-1.07-1.03-1.36-1.03-1.36-.85-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.83 1.42 2.18 1.01 2.71.77.08-.6.32-1.01.59-1.24-2.05-.23-4.2-1.02-4.2-4.55 0-1.01.36-1.83.95-2.47-.1-.24-.42-1.18.09-2.44 0 0 .78-.25 2.55.94a8.8 8.8 0 0 1 4.64 0c1.77-1.19 2.55-.94 2.55-.94.51 1.26.19 2.2.09 2.44.59.64.95 1.46.95 2.47 0 3.54-2.16 4.32-4.21 4.55.33.29.63.86.63 1.73v2.38c0 .24.17.52.64.43A9.25 9.25 0 0 0 12 2.75Z",
    deploy:
      "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm5.8 7.25h-3.05a12.15 12.15 0 0 0-.87-4.05 6.53 6.53 0 0 1 3.92 4.05Zm-5.8-5.5c.47.68 1.06 2.1 1.2 5.5h-2.4c.14-3.4.73-4.82 1.2-5.5Zm-1.88 1.45a12.15 12.15 0 0 0-.87 4.05H6.2a6.53 6.53 0 0 1 3.92-4.05ZM6.2 12.75h3.05c.06 1.78.35 3.17.87 4.05a6.53 6.53 0 0 1-3.92-4.05Zm5.8 5.5c-.47-.68-1.06-2.1-1.2-5.5h2.4c-.14 3.4-.73 4.82-1.2 5.5Zm1.88-1.45c.52-.88.81-2.27.87-4.05h3.05a6.53 6.53 0 0 1-3.92 4.05Z",
    presentation:
      "M4.75 5.25h14.5v10.5H4.75V5.25Zm2 13.5 3-3m7.5 3-3-3M9 9h6m-6 3h4",
  };

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill={name === "presentation" ? "none" : "currentColor"}
      viewBox="0 0 24 24"
    >
      <path
        d={paths[name]}
        stroke={name === "presentation" ? "currentColor" : undefined}
        strokeLinecap={name === "presentation" ? "round" : undefined}
        strokeLinejoin={name === "presentation" ? "round" : undefined}
        strokeWidth={name === "presentation" ? "1.8" : undefined}
      />
    </svg>
  );
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("전체");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        const text = await response.text();
        const result = text ? (JSON.parse(text) as { projects?: Project[] }) : null;

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        setProjects(result?.projects ?? []);
      } catch {
        setError("프로젝트 목록을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filters = useMemo(
    () => ["전체", ...Array.from(new Set(projects.flatMap((project) => project.stacks))).sort()],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter =
        selectedFilter === "전체" || project.stacks.includes(selectedFilter);
      const searchableText = [project.title, project.summary, ...project.stacks]
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(normalizedQuery);
    });
  }, [projects, query, selectedFilter]);

  return (
    <section className="bg-white px-6 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-black sm:text-4xl">프로젝트 목록</h1>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start">
          <label className="sr-only" htmlFor="project-search">
            프로젝트 검색
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="프로젝트명이나 키워드를 검색하세요"
            className="h-12 w-full rounded-md border border-gray-300 bg-white px-5 text-sm text-gray-900 outline-none transition focus:border-black lg:w-[270px]"
          />

          <div className="flex flex-1 flex-wrap gap-2">
            {filters.map((filter) => {
              const isSelected = selectedFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`h-8 rounded-full px-4 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
            프로젝트를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
            {error}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const visibleStacks = project.stacks.slice(0, 4);
              const extraCount = project.stacks.length - visibleStacks.length;

              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`${project.title} 상세 보기`}
                    className="relative block h-52 overflow-hidden border-b border-gray-200"
                  >
                    <ProjectThumbnail src={project.thumbnailUrl} title={project.title} />
                  </Link>

                  <div className="p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h2 className="text-xl font-black text-black hover:text-gray-700">
                        {project.title}
                      </h2>
                    </Link>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">
                      {project.summary}
                    </p>

                    <div className="mt-5 flex min-h-14 flex-wrap content-start gap-2">
                      {visibleStacks.map((stack) => (
                        <span
                          key={stack}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-black"
                        >
                          {stack}
                        </span>
                      ))}
                      {extraCount > 0 ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-black">
                          +{extraCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 flex gap-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-black"
                        >
                          <Icon name="github" />
                          GitHub
                        </a>
                      ) : null}
                      {project.deployUrl ? (
                        <a
                          href={project.deployUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-black"
                        >
                          <Icon name="deploy" />
                          배포
                        </a>
                      ) : null}
                      <Link
                        href={`/projects/${project.slug}/present`}
                        className="inline-flex items-center gap-1.5 hover:text-black"
                      >
                        <Icon name="presentation" />
                        발표
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
            조건에 맞는 프로젝트가 없습니다.
          </div>
        ) : null}
      </div>
    </section>
  );
}
