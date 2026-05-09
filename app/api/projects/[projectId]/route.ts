import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createUniqueSlug,
  findProjectByIdOrSlug,
  normalizeProjectInput,
  projectWithStacks,
  serializeProject,
} from "@/lib/projects";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const admin = await requireAdmin();
  const project = await findProjectByIdOrSlug(projectId);

  if (!project || (!admin && project.visibility !== "PUBLIC")) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ project: serializeProject(project) });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const existing = await findProjectByIdOrSlug(projectId);

  if (!existing) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const input = normalizeProjectInput(body);

  if (!input.title || !input.summary || !input.description) {
    return NextResponse.json(
      { message: "프로젝트명, 한 줄 소개, 상세 설명은 필수입니다." },
      { status: 400 },
    );
  }

  const slug = input.slug || (await createUniqueSlug(input.title, existing.id));
  const project = await prisma.project.update({
    where: { id: existing.id },
    data: {
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl,
      githubUrl: input.githubUrl,
      deployUrl: input.deployUrl,
      deckUrl: input.deckUrl,
      readmeUrl: input.readmeUrl,
      visibility: input.visibility,
      features: input.features,
      architecture: input.architecture,
      troubleshooting: input.troubleshooting,
      retrospective: input.retrospective,
      stacks: {
        deleteMany: {},
        create: input.stacks.map((name) => ({ name })),
      },
    },
    ...projectWithStacks,
  });

  return NextResponse.json({ project: serializeProject(project) });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const existing = await findProjectByIdOrSlug(projectId);

  if (!existing) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.project.delete({ where: { id: existing.id } });

  return NextResponse.json({ ok: true });
}
