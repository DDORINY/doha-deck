type LoadingScreenProps = {
  title?: string;
  description?: string;
  variant?: "page" | "list" | "detail" | "present" | "admin";
};

function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

function CardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <PulseBlock className="h-52 rounded-none bg-gray-100" />
      <div className="p-6">
        <PulseBlock className="h-5 w-32" />
        <PulseBlock className="mt-4 h-4 w-full" />
        <PulseBlock className="mt-2 h-4 w-4/5" />
        <div className="mt-6 flex gap-2">
          <PulseBlock className="h-7 w-16 rounded-full" />
          <PulseBlock className="h-7 w-20 rounded-full" />
          <PulseBlock className="h-7 w-14 rounded-full" />
        </div>
      </div>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <section className="rounded-2xl bg-gray-50 px-7 py-10 sm:px-14 sm:py-14">
        <PulseBlock className="h-10 w-64 sm:h-12" />
        <PulseBlock className="mt-6 h-4 w-full max-w-3xl" />
        <PulseBlock className="mt-3 h-4 w-2/3 max-w-2xl" />
        <PulseBlock className="mt-7 h-8 w-36 rounded-full" />
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="rounded-xl border border-gray-200 bg-white p-7">
            <PulseBlock className="h-4 w-16" />
            <div className="mt-7 space-y-5">
              <PulseBlock className="h-4 w-24" />
              <PulseBlock className="h-4 w-20" />
              <PulseBlock className="h-4 w-28" />
            </div>
          </div>
        </aside>
        <div className="space-y-8">
          {[0, 1, 2].map((item) => (
            <section key={item} className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
              <PulseBlock className="h-8 w-44" />
              <PulseBlock className="mt-8 h-4 w-full" />
              <PulseBlock className="mt-3 h-4 w-11/12" />
              <PulseBlock className="mt-3 h-4 w-3/4" />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function PresentSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[278px_1fr]">
        <aside className="hidden border-r border-white/10 bg-zinc-900 p-6 lg:block">
          <div className="h-6 w-28 animate-pulse rounded bg-white/20" />
          <div className="mt-12 space-y-5">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className="h-11 animate-pulse rounded-lg bg-white/10" />
            ))}
          </div>
        </aside>
        <main className="flex items-center justify-center p-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-12 text-black sm:p-16">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 h-12 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-[#080808] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-white/15" />
          <div className="h-10 w-36 animate-pulse rounded bg-white/15" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-5 h-9 w-16 animate-pulse rounded bg-white/15" />
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="h-5 w-32 animate-pulse rounded bg-white/15" />
          <div className="mt-8 space-y-5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingScreen({
  title = "콘텐츠를 불러오는 중입니다",
  description = "잠시만 기다려주세요.",
  variant = "page",
}: LoadingScreenProps) {
  if (variant === "detail") {
    return <DetailSkeleton />;
  }

  if (variant === "present") {
    return <PresentSkeleton />;
  }

  if (variant === "admin") {
    return <AdminSkeleton />;
  }

  if (variant === "list") {
    return (
      <section className="bg-white px-6 py-12 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <PulseBlock className="h-12 w-full lg:w-[270px]" />
            <div className="flex flex-1 flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <PulseBlock key={item} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <CardSkeleton key={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        </div>
        <h1 className="mt-6 text-xl font-black text-black">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </section>
  );
}
