import { NextRequest, NextResponse } from "next/server";
import { apiError } from "../../../lib/api";
import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import {
  createUniqueSlug,
  normalizeProjectInput,
  projectWithStacks,
  serializeProject,
} from "../../../lib/projects";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const { searchParams } = request.nextUrl;
    const includePrivate = searchParams.get("includePrivate") === "1";
    const q = searchParams.get("q")?.trim();
    const stack = searchParams.get("stack")?.trim();

    if (includePrivate && !admin) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ...(admin && includePrivate ? {} : { visibility: "PUBLIC" as const }),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" as const } },
                { summary: { contains: q, mode: "insensitive" as const } },
                { description: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
        ...(stack && stack !== "전체"
          ? { stacks: { some: { name: { equals: stack, mode: "insensitive" as const } } } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      ...projectWithStacks,
    });

    const stats =
      admin && includePrivate
        ? {
            total: await prisma.project.count(),
            public: await prisma.project.count({ where: { visibility: "PUBLIC" } }),
            private: await prisma.project.count({ where: { visibility: "PRIVATE" } }),
            stacks: await prisma.projectStack.count(),
          }
        : null;

    return NextResponse.json({
      projects: projects.map(serializeProject),
      stats,
    });
  } catch (error) {
    return apiError("프로젝트 목록 조회 중 오류가 발생했습니다.", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
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

    const slug = input.slug || (await createUniqueSlug(input.title));
    const project = await prisma.project.create({
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
          create: input.stacks.map((name) => ({ name })),
        },
      },
      ...projectWithStacks,
    });

    return NextResponse.json({ project: serializeProject(project) }, { status: 201 });
  } catch (error) {
    return apiError("프로젝트 등록 중 오류가 발생했습니다.", error);
  }
}
