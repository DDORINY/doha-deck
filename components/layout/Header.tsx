"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminSession = {
  id: string;
  email: string;
  name: string;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  useEffect(() => {
    if (pathname.endsWith("/present")) {
      return;
    }

    const loadSession = async () => {
      const response = await fetch("/api/auth", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as {
        authenticated: boolean;
        admin: AdminSession | null;
      };

      setAdmin(result.authenticated ? result.admin : null);
    };

    loadSession();
  }, [pathname]);

  if (pathname.endsWith("/present")) {
    return null;
  }

  if (pathname.startsWith("/admin")) {
    const dashboardActive = pathname === "/admin/dashboard";
    const projectFormActive = pathname.startsWith("/admin/projects");

    const handleLogout = async () => {
      await fetch("/api/auth", { method: "DELETE" });
      setAdmin(null);
      router.push("/admin/login");
      router.refresh();
    };

    return (
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/admin/dashboard" className="flex items-end gap-2">
            <span className="text-xl font-bold">DOHA Deck</span>
            <span className="pb-0.5 text-xs text-gray-400">Admin</span>
          </Link>

          <nav className="flex items-center gap-7 text-sm text-gray-400">
            <Link
              href="/admin/dashboard"
              className={dashboardActive ? "font-bold text-white" : "hover:text-white"}
            >
              대시보드
            </Link>
            <Link
              href="/admin/projects/new"
              className={projectFormActive ? "font-bold text-white" : "hover:text-white"}
            >
              프로젝트 등록
            </Link>
            <Link href="/projects" className="hover:text-white">
              공개 사이트 보기
            </Link>
            <button type="button" onClick={handleLogout} className="hover:text-white">
              로그아웃
            </button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          DOHA Deck
        </Link>

        <nav className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/projects" className="hover:text-black">
            프로젝트
          </Link>
          <Link href={admin ? "/admin/dashboard" : "/admin/login"} className="hover:text-black">
            {admin?.name ?? "관리자 로그인"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
