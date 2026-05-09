import Link from "next/link";

const features = [
  {
    title: "발표자료 관리",
    description:
      "프로젝트 발표 슬라이드를 하나의 링크로 정리하고 공유하세요. 면접이나 데모데이에서 바로 사용할 수 있습니다.",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 5.5h16v11H4zM8 19h8M10 8.5h4M8 12h8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "링크 아카이브",
    description:
      "GitHub, 배포 URL, README 등 프로젝트와 관련된 모든 링크를 한 곳에 모아 관리하세요.",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10 5.9M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1L14 18.1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "포트폴리오 공유",
    description:
      "정리된 프로젝트를 간단한 링크 하나로 공유하고, 발표 모드에서 깔끔하게 보여주세요.",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 12.5 16 8M8 11.5l8 4.5M6.5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17.5 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17.5 20.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex min-h-[calc(100svh-18rem)] max-w-6xl items-center justify-center px-6 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="mx-auto max-w-[820px] text-[2.55rem] font-black leading-[1.18] tracking-normal text-black sm:text-6xl sm:leading-[1.12] lg:text-7xl">
            <span className="block">프로젝트 발표자료와</span>
            <span className="block">
              배포 링크를 <span className="text-green-500">한 곳에</span>{" "}
              <span className="whitespace-nowrap">정리합니다</span>
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            DOHA Deck은 개발 프로젝트의 발표자료, GitHub 링크, 배포 URL, 기술스택,
            트러블슈팅과 회고를 정리한 개인 프로젝트 아카이브입니다.
          </p>

          <div className="mt-9">
            <Link
              href="/projects"
              className="inline-flex h-14 items-center justify-center rounded-md bg-black px-9 text-base font-bold text-white transition-colors hover:bg-gray-800"
            >
              프로젝트 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="min-h-64 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
                {feature.icon}
              </div>
              <h2 className="text-xl font-black text-black">{feature.title}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
