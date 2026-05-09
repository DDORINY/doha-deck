"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(result?.message ?? "로그인에 실패했습니다.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#0b0b0b] px-6 py-16 text-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 p-8"
      >
        <h1 className="text-2xl font-black">관리자 로그인</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          개인 포트폴리오 CMS 관리를 위한 로그인 화면입니다.
        </p>

        <label className="mt-8 block text-sm font-bold text-white">
          이메일
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-3 h-11 w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-green-500"
          />
        </label>

        <label className="mt-5 block text-sm font-bold text-white">
          비밀번호
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-3 h-11 w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-green-500"
          />
        </label>

        {error ? <p className="mt-4 text-sm font-semibold text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-md bg-white text-sm font-black text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
