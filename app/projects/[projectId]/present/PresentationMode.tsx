"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProjectPresentation = {
  id: string;
  title: string;
  subtitle: string;
  youtubeUrl: string;
  slides: {
    title: string;
    body: string;
    points?: string[];
  }[];
};

function getYoutubeEmbedUrl(url: string) {
  const value = url.trim();

  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return value;
      }
    }
  } catch {
    return "";
  }

  return "";
}

export default function PresentationMode({
  project,
}: {
  project: ProjectPresentation;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = project.slides[currentIndex];
  const embedUrl = useMemo(
    () => getYoutubeEmbedUrl(project.youtubeUrl),
    [project.youtubeUrl],
  );

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
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-gray-300 hover:text-white"
          >
            ← 상세 페이지로 돌아가기
          </Link>
        </div>
      </aside>

      <main className="flex min-h-[calc(100svh-81px)] flex-col lg:min-h-svh">
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10">
          <section className="w-full max-w-4xl rounded-3xl bg-white px-8 py-10 text-gray-900 shadow-2xl sm:px-16 sm:py-16">
            <p className="text-sm font-medium text-gray-400">
              {currentIndex + 1} / {project.slides.length}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-normal text-black sm:text-5xl">
              {currentSlide.title}
            </h2>

            <p className="mt-8 text-base leading-8 text-gray-700 sm:text-lg">
              {currentSlide.body}
            </p>

            {currentSlide.points?.length ? (
              <ul className="mt-8 space-y-4 text-base text-gray-700">
                {currentSlide.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {currentSlide.title === "시연 자료" && embedUrl ? (
              <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-gray-950">
                <iframe
                  src={embedUrl}
                  title={`${project.title} 시연 영상`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : null}
          </section>
        </div>

        <div className="grid h-16 grid-cols-3 items-center border-t border-white/10 px-5 text-sm sm:px-10">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="justify-self-start text-gray-300 disabled:text-gray-700"
          >
            ← 이전
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
            다음 →
          </button>
        </div>
      </main>
    </div>
  );
}
