/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { convertYoutubeEmbedUrl } from "../../../../lib/utils";

type SlideGroup = {
  title: string;
  points: string[];
};

type ProjectPresentation = {
  id: string;
  title: string;
  subtitle: string;
  deployUrl: string;
  demoYoutubeUrl: string;
  demoFileUrl: string;
  demoFileName: string;
  demoFileType: string;
  demoFileSize: number | null;
  slides: {
    title: string;
    body: string;
    imageUrl?: string;
    points?: string[];
    groups?: SlideGroup[];
  }[];
};

function formatBytes(size: number | null) {
  if (!size) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function PointList({ points }: { points: string[] }) {
  if (points.length === 0) {
    return null;
  }

  return (
    <ul className="mt-5 space-y-4 text-base text-gray-700">
      {points.map((point) => (
        <li key={point} className="flex gap-3">
          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function DemoContent({ project }: { project: ProjectPresentation }) {
  const embedUrl = project.demoYoutubeUrl
    ? convertYoutubeEmbedUrl(project.demoYoutubeUrl)
    : "";

  if (project.demoYoutubeUrl) {
    return (
      <iframe
        src={embedUrl}
        title={`${project.title} 시연 영상`}
        className="mt-8 aspect-video w-full rounded-xl bg-gray-950"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (project.demoFileUrl) {
    return (
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
        <p className="font-bold text-black">{project.demoFileName || "시연 파일"}</p>
        {(project.demoFileType || project.demoFileSize) && (
          <p className="mt-2 text-gray-500">
            {project.demoFileType || "파일"} {formatBytes(project.demoFileSize)}
          </p>
        )}
        <a
          href={project.demoFileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-10 items-center rounded-md bg-black px-4 font-bold text-white"
        >
          시연 파일 보기
        </a>
      </div>
    );
  }

  if (project.deployUrl) {
    return (
      <a
        href={project.deployUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-black px-5 text-sm font-bold text-white"
      >
        배포 사이트 보기
      </a>
    );
  }

  return <p className="mt-8 text-sm text-gray-500">등록된 시연 자료가 없습니다.</p>;
}

export default function PresentationMode({
  project,
}: {
  project: ProjectPresentation;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = project.slides[currentIndex];

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, project.slides.length - 1));
  }, [project.slides.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  const isDemoSlide = currentSlide.title === "시연 자료";

  return (
    <div className="grid min-h-svh bg-black text-white lg:grid-cols-[278px_1fr]">
      <aside className="border-b border-white/10 bg-[#1b1b1b] lg:border-b-0 lg:border-r">
        <div className="border-b border-white/10 px-5 py-6">
          <h1 className="text-xl font-black">{project.title}</h1>
          <p className="mt-2 text-sm text-gray-400">발표 모드</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:gap-3 lg:overflow-visible">
          {project.slides.map((slide, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={slide.title}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-11 shrink-0 rounded-md px-4 text-left text-sm font-semibold transition-colors lg:h-11 ${
                  isActive
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {index + 1}. {slide.title}
              </button>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/10 p-4 lg:fixed lg:bottom-0 lg:left-0 lg:block lg:w-[278px]">
          <Link href={`/projects/${project.id}`} className="text-sm text-gray-300 hover:text-white">
            상세 페이지로 돌아가기
          </Link>
        </div>
      </aside>

      <main className="flex min-h-[calc(100svh-81px)] flex-col lg:min-h-svh">
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10">
          <section className="max-h-[calc(100svh-7rem)] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white px-8 py-10 text-gray-900 shadow-2xl sm:px-16 sm:py-16">
            <p className="text-sm font-medium text-gray-400">
              {currentIndex + 1} / {project.slides.length}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-normal text-black sm:text-5xl">
              {currentSlide.title}
            </h2>

            <p className="mt-8 whitespace-pre-line text-base leading-8 text-gray-700 sm:text-lg">
              {currentSlide.body}
            </p>

            {currentSlide.points ? <PointList points={currentSlide.points} /> : null}

            {currentSlide.groups?.length ? (
              <div className="mt-8 space-y-8">
                {currentSlide.groups.map((group) =>
                  group.points.length ? (
                    <div key={group.title}>
                      <h3 className="text-base font-black text-black">{group.title}</h3>
                      <PointList points={group.points} />
                    </div>
                  ) : null,
                )}
              </div>
            ) : null}

            {currentSlide.imageUrl ? (
              <img
                src={currentSlide.imageUrl}
                alt={`${currentSlide.title} 이미지`}
                className="mt-8 w-full rounded-xl border border-gray-200 bg-gray-50 object-cover"
              />
            ) : null}

            {isDemoSlide ? <DemoContent project={project} /> : null}
          </section>
        </div>

        <div className="grid h-16 grid-cols-3 items-center border-t border-white/10 px-5 text-sm sm:px-10">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="justify-self-start text-gray-300 disabled:text-gray-700"
          >
            이전
          </button>

          <div className="flex justify-center gap-2">
            {project.slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`${index + 1}번 슬라이드로 이동`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-green-500" : "bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === project.slides.length - 1}
            className="justify-self-end text-gray-300 disabled:text-gray-700"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
