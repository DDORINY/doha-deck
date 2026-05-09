"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdminProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  visibility: "PUBLIC" | "PRIVATE";
  stacks: string[];
  createdAt: string;
};

type ApiResponse = {
  projects?: AdminProject[];
  stats?: {
    total: number;
    public: number;
    private: number;
    stacks: number;
  } | null;
  message?: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [stats, setStats] = useState<ApiResponse["stats"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects?includePrivate=1", {
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        const text = await response.text();
        const result = text ? (JSON.parse(text) as ApiResponse) : null;

        if (!response.ok) {
          throw new Error(result?.message ?? "프로젝트 목록을 불러오지 못했습니다.");
        }

        setProjects(result?.projects ?? []);
        setStats(result?.stats ?? null);
      } catch {
        setError("프로젝트 목록을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [router]);

  const summary = useMemo(
    () =>
      stats ?? {
        total: projects.length,
        public: projects.filter((project) => project.visibility === "PUBLIC").length,
        private: projects.filter((project) => project.visibility === "PRIVATE").length,
        stacks: projects.reduce((count, project) => count + project.stacks.length, 0),
      },
    [projects, stats],
  );

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#0b0b0b] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-black sm:text-4xl">관리자 대시보드</h1>
          <Link
            href="/admin/projects/new"
            className="inline-flex h-11 w-fit items-center justify-center rounded-md bg-white px-6 text-sm font-black text-black hover:bg-zinc-100"
          >
            + 새 프로젝트 등록
          </Link>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            ["전체 프로젝트", summary.total],
            ["공개 프로젝트", summary.public],
            ["비공개 프로젝트", summary.private],
            ["등록 스택", summary.stacks],
          ].map(([label, value]) => (
            <article key={label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-8">
              <p className="text-sm font-semibold text-slate-400">{label}</p>
              <p className="mt-4 text-4xl font-black">
                {value}
                <span className="ml-1 text-sm font-medium text-slate-500">개</span>
              </p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex items-end justify-between">
          <h2 className="text-2xl font-black">프로젝트 관리</h2>
          <span className="text-sm text-slate-400">총 {projects.length}개</span>
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_90px_132px] gap-5 border-b border-zinc-800 px-6 py-4 text-sm text-slate-400">
            <span>프로젝트명</span>
            <span>한 줄 소개</span>
            <span>기술스택</span>
            <span>상태</span>
            <span>관리</span>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              프로젝트를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-sm text-red-400">{error}</div>
          ) : projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              등록된 프로젝트가 없습니다.
            </div>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="grid grid-cols-[1.2fr_1.6fr_1.2fr_90px_132px] items-center gap-5 border-b border-zinc-800 px-6 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-black text-white">{project.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(project.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <p className="truncate text-sm text-slate-300">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stacks.slice(0, 3).map((stack) => (
                    <span key={stack} className="rounded bg-zinc-900 px-2 py-1 text-xs">
                      {stack}
                    </span>
                  ))}
                  {project.stacks.length > 3 ? (
                    <span className="rounded bg-zinc-900 px-2 py-1 text-xs">
                      +{project.stacks.length - 3}
                    </span>
                  ) : null}
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                    project.visibility === "PUBLIC"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-slate-500/20 text-slate-300"
                  }`}
                >
                  {project.visibility === "PUBLIC" ? "공개" : "비공개"}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.slug}/edit`}
                    className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-bold hover:bg-zinc-800"
                  >
                    수정
                  </Link>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-bold hover:bg-zinc-800"
                  >
                    보기
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
