export function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `project-${Date.now()}`;
}

export function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function cleanStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(value.map((item) => cleanString(item)).filter(Boolean)),
  );
}

export function parseStoredList(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return cleanStringList(parsed);
    }
  } catch {
    // Older data may be saved as newline-separated text.
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyList(value: unknown) {
  return JSON.stringify(cleanStringList(value));
}

export function convertYoutubeEmbedUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    return url;
  } catch {
    return url;
  }
}
