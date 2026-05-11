import { NextRequest, NextResponse } from "next/server";
import { apiError } from "../../../../lib/api";
import { requireAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import {
  createUniqueSlug,
  findProjectByIdOrSlug,
  normalizeProjectInput,
  projectWithStacks,
  serializeProject,
} from "../../../../lib/projects";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;
    const admin = await requireAdmin(request);
    const project = await findProjectByIdOrSlug(projectId);

    if (!project || (!admin && project.visibility !== "PUBLIC")) {
      return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ project: serializeProject(project) });
  } catch (error) {
    return apiError("프로젝트 상세 조회 중 오류가 발생했습니다.", error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const admin = await requireAdmin(request);

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
        demoYoutubeUrl: input.demoYoutubeUrl,
        demoFileUrl: input.demoFileUrl,
        demoFileName: input.demoFileName,
        demoFileType: input.demoFileType,
        demoFileSize: input.demoFileSize,
        visibility: input.visibility,
        features: input.features,
        basicFeatures: input.basicFeatures,
        advancedFeatures: input.advancedFeatures,
        architecture: input.architecture,
        codeReview: input.codeReview,
        troubleshooting: input.troubleshooting,
        retrospective: input.retrospective,
        stacksImageUrl: input.stacksImageUrl,
        overviewImageUrl: input.overviewImageUrl,
        featuresImageUrl: input.featuresImageUrl,
        architectureImageUrl: input.architectureImageUrl,
        codeReviewImageUrl: input.codeReviewImageUrl,
        troubleshootingImageUrl: input.troubleshootingImageUrl,
        retrospectiveImageUrl: input.retrospectiveImageUrl,
        stacks: {
          deleteMany: {},
          create: input.stacks.map((name) => ({ name })),
        },
      },
      ...projectWithStacks,
    });

    return NextResponse.json({ project: serializeProject(project) });
  } catch (error) {
    return apiError("프로젝트 수정 중 오류가 발생했습니다.", error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const admin = await requireAdmin(request);

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
  } catch (error) {
    return apiError("프로젝트 삭제 중 오류가 발생했습니다.", error);
  }
}
