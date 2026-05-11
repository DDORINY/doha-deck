import type { Prisma, ProjectVisibility } from "@prisma/client";
import { prisma } from "./prisma";
import {
  cleanString,
  cleanStringList,
  parseStoredList,
  slugify,
  stringifyList,
} from "./utils";

const projectWithStacks = {
  include: {
    stacks: {
      orderBy: { createdAt: "asc" as const },
    },
  },
};

export type ProjectRecord = Prisma.ProjectGetPayload<typeof projectWithStacks>;

export function serializeProject(project: ProjectRecord) {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    deployUrl: project.deployUrl ?? "",
    deckUrl: project.deckUrl ?? "",
    readmeUrl: project.readmeUrl ?? "",
    demoYoutubeUrl: project.demoYoutubeUrl ?? "",
    demoFileUrl: project.demoFileUrl ?? "",
    demoFileName: project.demoFileName ?? "",
    demoFileType: project.demoFileType ?? "",
    demoFileSize: project.demoFileSize ?? null,
    visibility: project.visibility,
    features: parseStoredList(project.features),
    basicFeatures: parseStoredList(project.basicFeatures).length
      ? parseStoredList(project.basicFeatures)
      : parseStoredList(project.features),
    advancedFeatures: parseStoredList(project.advancedFeatures),
    architecture: project.architecture ?? "",
    codeReview: project.codeReview ?? "",
    troubleshooting: project.troubleshooting ?? "",
    retrospective: project.retrospective ?? "",
    stacksImageUrl: project.stacksImageUrl ?? "",
    overviewImageUrl: project.overviewImageUrl ?? "",
    featuresImageUrl: project.featuresImageUrl ?? "",
    architectureImageUrl: project.architectureImageUrl ?? "",
    codeReviewImageUrl: project.codeReviewImageUrl ?? "",
    troubleshootingImageUrl: project.troubleshootingImageUrl ?? "",
    retrospectiveImageUrl: project.retrospectiveImageUrl ?? "",
    stacks: project.stacks.map((stack) => stack.name),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function createUniqueSlug(title: string, currentProjectId?: string) {
  const base = slugify(title);
  let candidate = base;
  let index = 2;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === currentProjectId) {
      return candidate;
    }

    candidate = `${base}-${index}`;
    index += 1;
  }
}

export function normalizeVisibility(value: unknown): ProjectVisibility {
  return String(value).toUpperCase() === "PRIVATE" ? "PRIVATE" : "PUBLIC";
}

export function normalizeProjectInput(body: Record<string, unknown>) {
  return {
    title: cleanString(body.title),
    slug: cleanString(body.slug),
    summary: cleanString(body.summary),
    description: cleanString(body.description),
    thumbnailUrl: cleanString(body.thumbnailUrl) || null,
    githubUrl: cleanString(body.githubUrl) || null,
    deployUrl: cleanString(body.deployUrl) || null,
    deckUrl: cleanString(body.deckUrl) || null,
    readmeUrl: cleanString(body.readmeUrl) || null,
    demoYoutubeUrl: cleanString(body.demoYoutubeUrl) || null,
    demoFileUrl: cleanString(body.demoFileUrl) || null,
    demoFileName: cleanString(body.demoFileName) || null,
    demoFileType: cleanString(body.demoFileType) || null,
    demoFileSize:
      typeof body.demoFileSize === "number" && Number.isFinite(body.demoFileSize)
        ? body.demoFileSize
        : null,
    visibility: normalizeVisibility(body.visibility),
    stacks: cleanStringList(body.stacks),
    features: stringifyList(body.features),
    basicFeatures: stringifyList(body.basicFeatures),
    advancedFeatures: stringifyList(body.advancedFeatures),
    architecture: cleanString(body.architecture) || null,
    codeReview: cleanString(body.codeReview) || null,
    troubleshooting: cleanString(body.troubleshooting) || null,
    retrospective: cleanString(body.retrospective) || null,
    stacksImageUrl: cleanString(body.stacksImageUrl) || null,
    overviewImageUrl: cleanString(body.overviewImageUrl) || null,
    featuresImageUrl: cleanString(body.featuresImageUrl) || null,
    architectureImageUrl: cleanString(body.architectureImageUrl) || null,
    codeReviewImageUrl: cleanString(body.codeReviewImageUrl) || null,
    troubleshootingImageUrl: cleanString(body.troubleshootingImageUrl) || null,
    retrospectiveImageUrl: cleanString(body.retrospectiveImageUrl) || null,
  };
}

export async function findProjectByIdOrSlug(identifier: string) {
  return prisma.project.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    ...projectWithStacks,
  });
}

export { projectWithStacks };
