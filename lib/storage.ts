type UploadResult = {
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
};

const DEFAULT_BUCKET = "project-assets";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function getStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage 환경변수가 필요합니다. NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정해주세요.",
    );
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
    bucket,
  };
}

function sanitizeFileName(fileName: string) {
  const extension = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName || "file"}${extension.toLowerCase()}`;
}

function createStoragePath(file: File, folder: string) {
  const now = new Date();
  const datePath = now.toISOString().slice(0, 10);
  const random = crypto.randomUUID();
  const safeFileName = sanitizeFileName(file.name);

  return `${folder}/${datePath}/${random}-${safeFileName}`;
}

export function assertUploadableFile(file: File, kind: string) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("25MB 이하의 파일만 업로드할 수 있습니다.");
  }

  if (kind === "image" && !file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
}

export async function uploadFileToStorage(file: File, kind = "file"): Promise<UploadResult> {
  assertUploadableFile(file, kind);

  const { supabaseUrl, serviceRoleKey, bucket } = getStorageConfig();
  const folder = kind === "image" ? "images" : "files";
  const path = createStoragePath(file, folder);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(result?.message ?? "Supabase Storage 업로드에 실패했습니다.");
  }

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    path,
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`,
  };
}
