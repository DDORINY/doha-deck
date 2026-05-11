import { NextRequest, NextResponse } from "next/server";
import { apiError } from "../../../lib/api";
import { requireAdmin } from "../../../lib/auth";
import { uploadFileToStorage } from "../../../lib/storage";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ files: [] });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "업로드할 파일을 선택해주세요." }, { status: 400 });
    }

    const uploadedFile = await uploadFileToStorage(file, kind);

    return NextResponse.json({ file: uploadedFile });
  } catch (error) {
    return apiError("파일 업로드 중 오류가 발생했습니다.", error);
  }
}
