import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { apiError } from "../../../lib/api";
import {
  clearSessionCookie,
  createSessionToken,
  getAdminSession,
  setSessionCookie,
} from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const admin = await getAdminSession();

    return NextResponse.json({
      authenticated: Boolean(admin),
      admin,
    });
  } catch (error) {
    return apiError("관리자 세션 확인 중 오류가 발생했습니다.", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string }
      | null;
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return NextResponse.json(
        { message: "관리자 계정 정보를 확인해주세요." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    setSessionCookie(response, createSessionToken(admin));

    return response;
  } catch (error) {
    return apiError("관리자 로그인 처리 중 오류가 발생했습니다.", error);
  }
}

export function DELETE() {
  try {
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);

    return response;
  } catch (error) {
    return apiError("관리자 로그아웃 처리 중 오류가 발생했습니다.", error);
  }
}
