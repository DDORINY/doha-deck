"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";

function TagInput({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [value, setValue] = useState("");

  const addItem = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    if (!items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }

    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      <label className="text-sm font-bold text-white">{label}</label>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        placeholder={placeholder}
        className="mt-3 h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
      />
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(items.filter((value) => value !== item))}
              className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-700"
            >
              {item} x
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 h-12 w-full rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-slate-400 focus:border-green-500"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required,
  rows = 5,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white">{label}</label>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
      />
    </div>
  );
}

function DemoAssetFields() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      setFileName("");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/files", { method: "POST", body: formData });
    setUploading(false);

    setFileName(response.ok ? file.name : "파일 확인에 실패했습니다.");
  };

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-5">
      <h2 className="text-sm font-black text-white">시연 자료</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        등록/수정 화면에서만 관리하는 시연 영상 링크와 파일 미리보기입니다.
      </p>

      <div className="mt-5 space-y-5">
        <TextField
          label="YouTube 시연 영상 URL"
          name="demoYoutubeUrl"
          placeholder="https://youtu.be/..."
        />

        <div>
          <label className="text-sm font-bold text-white">시연 파일 업로드</label>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={(event) => handleFile(event.target.files?.[0])}
            className="mt-3 block w-full text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-sm file:font-black file:text-black hover:file:bg-zinc-100"
          />
          <p className="mt-2 text-xs text-slate-500">
            {uploading
              ? "파일 확인 중..."
              : fileName || "이미지, 영상, PDF 파일을 선택할 수 있습니다."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function NewProjectForm() {
  const router = useRouter();
  const [visibility, setVisibility] = useState("PUBLIC");
  const [stacks, setStacks] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        summary: formData.get("summary"),
        description: formData.get("description"),
        githubUrl: formData.get("githubUrl"),
        deployUrl: formData.get("deployUrl"),
        deckUrl: formData.get("deckUrl"),
        readmeUrl: formData.get("readmeUrl"),
        architecture: formData.get("architecture"),
        troubleshooting: formData.get("troubleshooting"),
        retrospective: formData.get("retrospective"),
        visibility,
        stacks,
        features,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(result?.message ?? "프로젝트 등록에 실패했습니다.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-9 pb-16">
      <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
        새 프로젝트 등록
      </h1>

      <TextField label="프로젝트명" name="title" placeholder="프로젝트명을 입력하세요" required />

      <TextField
        label="한 줄 소개"
        name="summary"
        placeholder="프로젝트를 한 줄로 소개해주세요"
        required
      />

      <TextArea
        label="상세 설명"
        name="description"
        placeholder="프로젝트에 대한 상세 설명을 입력하세요"
        rows={6}
        required
      />

      <TagInput
        label="기술스택"
        placeholder="기술스택을 입력하고 Enter를 눌러 추가하세요. 예: React"
        items={stacks}
        onChange={setStacks}
      />

      <TagInput
        label="주요 기능"
        placeholder="주요 기능을 입력하고 Enter를 눌러 추가하세요"
        items={features}
        onChange={setFeatures}
      />

      <TextField label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." />
      <TextField label="배포 URL" name="deployUrl" placeholder="https://..." />
      <TextField label="발표자료 URL" name="deckUrl" placeholder="https://slides.com/..." />
      <TextField
        label="README URL"
        name="readmeUrl"
        placeholder="https://github.com/.../blob/main/README.md"
      />

      <DemoAssetFields />

      <TextArea
        label="아키텍처"
        name="architecture"
        placeholder="프로젝트의 아키텍처를 설명해주세요"
        rows={5}
      />

      <TextArea
        label="트러블슈팅"
        name="troubleshooting"
        placeholder="프로젝트를 진행하며 해결한 문제들을 기록해보세요"
        rows={5}
      />

      <TextArea
        label="회고"
        name="retrospective"
        placeholder="프로젝트를 마무리하며 느낀 점을 작성해보세요"
        rows={5}
      />

      <fieldset>
        <legend className="text-sm font-bold text-white">공개 설정</legend>
        <div className="mt-4 flex gap-5 text-sm font-bold text-white">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={visibility === "PUBLIC"}
              onChange={(event) => setVisibility(event.target.value)}
              className="h-4 w-4 accent-white"
            />
            공개
          </label>
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="radio"
              name="visibility"
              value="PRIVATE"
              checked={visibility === "PRIVATE"}
              onChange={(event) => setVisibility(event.target.value)}
              className="h-4 w-4 accent-white"
            />
            비공개
          </label>
        </div>
      </fieldset>

      {error ? <p className="text-sm font-semibold text-red-400">{error}</p> : null}

      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-bold text-white hover:bg-zinc-800"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
