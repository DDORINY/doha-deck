"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FileUploadField from "../../../../../components/admin/FileUploadField";

function toNullableNumber(value: FormDataEntryValue | null) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

export type EditableProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  stacks: string[];
  features: string[];
  basicFeatures: string[];
  advancedFeatures: string[];
  githubUrl: string;
  deployUrl: string;
  deckUrl: string;
  readmeUrl: string;
  demoYoutubeUrl: string;
  demoFileUrl: string;
  demoFileName: string;
  demoFileType: string;
  demoFileSize: number | null;
  architecture: string;
  codeReview: string;
  troubleshooting: string;
  retrospective: string;
  overviewImageUrl: string;
  stacksImageUrl: string;
  featuresImageUrl: string;
  architectureImageUrl: string;
  codeReviewImageUrl: string;
  troubleshootingImageUrl: string;
  retrospectiveImageUrl: string;
  visibility: "PUBLIC" | "PRIVATE";
};

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
    if (!trimmed) return;
    if (!items.includes(trimmed)) onChange([...items, trimmed]);
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

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-3 h-12 w-full rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-slate-400 focus:border-green-500"
      />
    </div>
  );
}

function Area({
  label,
  name,
  defaultValue,
  required,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="mt-3 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
      />
    </div>
  );
}

function SectionImageFields({ project }: { project: EditableProject }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-5">
      <h2 className="text-sm font-black text-white">섹션 이미지</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        새 파일을 선택하면 기존 이미지 URL이 업로드된 파일 URL로 교체됩니다.
      </p>
      <div className="mt-5 space-y-5">
        <FileUploadField label="프로젝트 개요 이미지" name="overviewImageUrl" initialUrl={project.overviewImageUrl} />
        <FileUploadField label="주요 기능 이미지" name="featuresImageUrl" initialUrl={project.featuresImageUrl} />
        <FileUploadField label="기술스택 이미지" name="stacksImageUrl" initialUrl={project.stacksImageUrl} />
        <FileUploadField label="아키텍처 이미지" name="architectureImageUrl" initialUrl={project.architectureImageUrl} />
        <FileUploadField label="코드리뷰 이미지" name="codeReviewImageUrl" initialUrl={project.codeReviewImageUrl} />
        <FileUploadField label="트러블슈팅 이미지" name="troubleshootingImageUrl" initialUrl={project.troubleshootingImageUrl} />
        <FileUploadField label="회고 이미지" name="retrospectiveImageUrl" initialUrl={project.retrospectiveImageUrl} />
      </div>
    </section>
  );
}

export default function EditProjectForm({ project }: { project: EditableProject }) {
  const router = useRouter();
  const [visibility, setVisibility] = useState(project.visibility);
  const [stacks, setStacks] = useState(project.stacks);
  const [basicFeatures, setBasicFeatures] = useState(project.basicFeatures);
  const [advancedFeatures, setAdvancedFeatures] = useState(project.advancedFeatures);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const features = [...basicFeatures, ...advancedFeatures];
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        summary: formData.get("summary"),
        description: formData.get("description"),
        thumbnailUrl: formData.get("thumbnailUrl"),
        githubUrl: formData.get("githubUrl"),
        deployUrl: formData.get("deployUrl"),
        deckUrl: formData.get("deckUrl"),
        readmeUrl: formData.get("readmeUrl"),
        demoYoutubeUrl: formData.get("demoYoutubeUrl"),
        demoFileUrl: formData.get("demoFileUrl"),
        demoFileName: formData.get("demoFileName"),
        demoFileType: formData.get("demoFileType"),
        demoFileSize: toNullableNumber(formData.get("demoFileSize")),
        architecture: formData.get("architecture"),
        codeReview: formData.get("codeReview"),
        troubleshooting: formData.get("troubleshooting"),
        retrospective: formData.get("retrospective"),
        overviewImageUrl: formData.get("overviewImageUrl"),
        featuresImageUrl: formData.get("featuresImageUrl"),
        stacksImageUrl: formData.get("stacksImageUrl"),
        architectureImageUrl: formData.get("architectureImageUrl"),
        codeReviewImageUrl: formData.get("codeReviewImageUrl"),
        troubleshootingImageUrl: formData.get("troubleshootingImageUrl"),
        retrospectiveImageUrl: formData.get("retrospectiveImageUrl"),
        visibility,
        stacks,
        features,
        basicFeatures,
        advancedFeatures,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(result?.message ?? "프로젝트 저장에 실패했습니다.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("이 프로젝트를 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.")) return;

    setDeleting(true);
    const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    setDeleting(false);

    if (!response.ok) {
      setError("프로젝트 삭제에 실패했습니다.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-9 pb-16">
      <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">프로젝트 수정</h1>

      <Field label="프로젝트명" name="title" defaultValue={project.title} required />
      <Field label="한 줄 소개" name="summary" defaultValue={project.summary} required />
      <Area label="프로젝트 개요" name="description" defaultValue={project.description} rows={6} required />

      <TagInput label="기술스택" placeholder="기술스택을 입력하고 Enter를 눌러 추가하세요" items={stacks} onChange={setStacks} />
      <TagInput label="기본 기능" placeholder="기본 기능을 입력하고 Enter를 눌러 추가하세요" items={basicFeatures} onChange={setBasicFeatures} />
      <TagInput label="고도화 기능" placeholder="고도화 기능을 입력하고 Enter를 눌러 추가하세요" items={advancedFeatures} onChange={setAdvancedFeatures} />

      <FileUploadField label="목록 썸네일 이미지" name="thumbnailUrl" initialUrl={project.thumbnailUrl} />
      <Field label="GitHub URL" name="githubUrl" defaultValue={project.githubUrl} />
      <Field label="배포 URL" name="deployUrl" defaultValue={project.deployUrl} />
      <Field label="발표자료 URL" name="deckUrl" defaultValue={project.deckUrl} />
      <Field label="README URL" name="readmeUrl" defaultValue={project.readmeUrl} />

      <section className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-5">
        <h2 className="text-sm font-black text-white">시연 자료</h2>
        <div className="mt-5 space-y-5">
          <Field label="YouTube 시연 영상 URL" name="demoYoutubeUrl" defaultValue={project.demoYoutubeUrl} />
          <FileUploadField
            label="시연 파일"
            name="demoFileUrl"
            kind="file"
            accept="image/*,video/*,application/pdf"
            initialUrl={project.demoFileUrl}
            initialFile={{
              name: project.demoFileName,
              type: project.demoFileType,
              size: project.demoFileSize,
            }}
            metadataNames={{
              fileName: "demoFileName",
              fileType: "demoFileType",
              fileSize: "demoFileSize",
            }}
          />
        </div>
      </section>

      <SectionImageFields project={project} />

      <Area label="아키텍처" name="architecture" defaultValue={project.architecture} />
      <Area label="코드리뷰" name="codeReview" defaultValue={project.codeReview} />
      <Area label="트러블슈팅" name="troubleshooting" defaultValue={project.troubleshooting} />
      <Area label="회고" name="retrospective" defaultValue={project.retrospective} />

      <fieldset>
        <legend className="text-sm font-bold text-white">공개 설정</legend>
        <div className="mt-4 flex gap-5 text-sm font-bold text-white">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={visibility === "PUBLIC"}
              onChange={(event) => setVisibility(event.target.value as "PUBLIC")}
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
              onChange={(event) => setVisibility(event.target.value as "PRIVATE")}
              className="h-4 w-4 accent-white"
            />
            비공개
          </label>
        </div>
      </fieldset>

      {error ? <p className="text-sm font-semibold text-red-400">{error}</p> : null}

      <div className="flex items-center justify-between gap-3 pt-4">
        <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-black text-red-400 hover:text-red-300 disabled:opacity-60">
          삭제
        </button>
        <div className="flex gap-3">
          <Link href="/admin/dashboard" className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-bold text-white hover:bg-zinc-800">
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </form>
  );
}
