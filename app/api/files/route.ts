import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ files: [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "업로드할 파일을 선택해주세요." }, { status: 400 });
  }

  return NextResponse.json({
    file: {
      name: file.name,
      type: file.type,
      size: file.size,
    },
  });
}
