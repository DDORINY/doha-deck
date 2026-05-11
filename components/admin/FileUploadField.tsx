"use client";

import { useState } from "react";

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  url: string;
};

type FileUploadFieldProps = {
  label: string;
  name: string;
  accept?: string;
  kind?: "image" | "file";
  initialUrl?: string;
  initialFile?: {
    name?: string;
    type?: string;
    size?: number | null;
  };
  metadataNames?: {
    fileName: string;
    fileType: string;
    fileSize: string;
  };
};

function formatFileSize(size?: number | null) {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function getNameFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
  } catch {
    return url.split("/").filter(Boolean).pop() ?? "";
  }
}

export default function FileUploadField({
  label,
  name,
  accept = "image/*",
  kind = "image",
  initialUrl = "",
  initialFile,
  metadataNames,
}: FileUploadFieldProps) {
  const [fileUrl, setFileUrl] = useState(initialUrl);
  const [fileName, setFileName] = useState(initialFile?.name || getNameFromUrl(initialUrl));
  const [fileType, setFileType] = useState(initialFile?.type ?? "");
  const [fileSize, setFileSize] = useState(initialFile?.size ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (file: File | undefined) => {
    setError("");

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    const result = (await response.json().catch(() => null)) as
      | { file?: UploadedFile; message?: string; error?: string }
      | null;

    if (!response.ok || !result?.file) {
      setError(result?.error || result?.message || "파일 업로드에 실패했습니다.");
      return;
    }

    setFileUrl(result.file.url);
    setFileName(result.file.name);
    setFileType(result.file.type);
    setFileSize(result.file.size);
  };

  const clearFile = () => {
    setFileUrl("");
    setFileName("");
    setFileType("");
    setFileSize(null);
    setError("");
  };

  return (
    <div>
      <label className="text-sm font-bold text-white">{label}</label>
      <input type="hidden" name={name} value={fileUrl} />
      {metadataNames ? (
        <>
          <input type="hidden" name={metadataNames.fileName} value={fileName} />
          <input type="hidden" name={metadataNames.fileType} value={fileType} />
          <input type="hidden" name={metadataNames.fileSize} value={fileSize ?? ""} />
        </>
      ) : null}

      <div className="mt-3 rounded-md border border-zinc-800 bg-zinc-950 p-4">
        <input
          type="file"
          accept={accept}
          onChange={(event) => handleFileChange(event.target.files?.[0])}
          className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-sm file:font-black file:text-black hover:file:bg-zinc-100"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {uploading ? <span>업로드 중...</span> : null}
          {!uploading && fileUrl ? (
            <>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="font-bold text-green-400">
                {fileName || "업로드된 파일 보기"}
              </a>
              {fileSize ? <span>{formatFileSize(fileSize)}</span> : null}
              <button type="button" onClick={clearFile} className="font-bold text-red-400">
                삭제
              </button>
            </>
          ) : null}
          {!uploading && !fileUrl ? <span>선택된 파일이 없습니다.</span> : null}
        </div>

        {error ? <p className="mt-2 text-xs font-semibold text-red-400">{error}</p> : null}
      </div>
    </div>
  );
}
