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
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    deployUrl: project.deployUrl ?? "",
    deckUrl: project.deckUrl ?? "",
    readmeUrl: project.readmeUrl ?? "",
    visibility: project.visibility,
    features: parseStoredList(project.features),
    architecture: project.architecture ?? "",
    troubleshooting: project.troubleshooting ?? "",
    retrospective: project.retrospective ?? "",
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
    visibility: normalizeVisibility(body.visibility),
    stacks: cleanStringList(body.stacks),
    features: stringifyList(body.features),
    architecture: cleanString(body.architecture) || null,
    troubleshooting: cleanString(body.troubleshooting) || null,
    retrospective: cleanString(body.retrospective) || null,
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
