"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FileUploadField from "../../../../components/admin/FileUploadField";

function toNullableNumber(value: FormDataEntryValue | null) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

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

function TextField({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        name={name}
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

function SectionImageFields() {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-5">
      <h2 className="text-sm font-black text-white">섹션 이미지</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        파일을 선택하면 Supabase Storage에 업로드되고, 프로젝트에는 업로드된 파일 URL이 저장됩니다.
      </p>
      <div className="mt-5 space-y-5">
        <FileUploadField label="프로젝트 개요 이미지" name="overviewImageUrl" />
        <FileUploadField label="주요 기능 이미지" name="featuresImageUrl" />
        <FileUploadField label="기술스택 이미지" name="stacksImageUrl" />
        <FileUploadField label="아키텍처 이미지" name="architectureImageUrl" />
        <FileUploadField label="코드리뷰 이미지" name="codeReviewImageUrl" />
        <FileUploadField label="트러블슈팅 이미지" name="troubleshootingImageUrl" />
        <FileUploadField label="회고 이미지" name="retrospectiveImageUrl" />
      </div>
    </section>
  );
}

function DemoAssetFields() {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-5">
      <h2 className="text-sm font-black text-white">시연 자료</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        YouTube 링크를 입력하거나, 시연 파일을 직접 업로드할 수 있습니다.
      </p>
      <div className="mt-5 space-y-5">
        <TextField label="YouTube 시연 영상 URL" name="demoYoutubeUrl" placeholder="https://youtu.be/..." />
        <FileUploadField
          label="시연 파일"
          name="demoFileUrl"
          kind="file"
          accept="image/*,video/*,application/pdf"
          metadataNames={{
            fileName: "demoFileName",
            fileType: "demoFileType",
            fileSize: "demoFileSize",
          }}
        />
      </div>
    </section>
  );
}

export default function NewProjectForm() {
  const router = useRouter();
  const [visibility, setVisibility] = useState("PUBLIC");
  const [stacks, setStacks] = useState<string[]>([]);
  const [basicFeatures, setBasicFeatures] = useState<string[]>([]);
  const [advancedFeatures, setAdvancedFeatures] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const features = [...basicFeatures, ...advancedFeatures];
    const response = await fetch("/api/projects", {
      method: "POST",
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
      setError(result?.message ?? "프로젝트 등록에 실패했습니다.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-9 pb-16">
      <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">새 프로젝트 등록</h1>

      <TextField label="프로젝트명" name="title" placeholder="프로젝트명을 입력하세요" required />
      <TextField label="한 줄 소개" name="summary" placeholder="프로젝트를 한 줄로 소개해주세요" required />
      <TextArea label="프로젝트 개요" name="description" placeholder="프로젝트 개요를 입력하세요" rows={6} required />

      <TagInput label="기술스택" placeholder="기술스택을 입력하고 Enter를 눌러 추가하세요" items={stacks} onChange={setStacks} />
      <TagInput label="기본 기능" placeholder="기본 기능을 입력하고 Enter를 눌러 추가하세요" items={basicFeatures} onChange={setBasicFeatures} />
      <TagInput label="고도화 기능" placeholder="고도화 기능을 입력하고 Enter를 눌러 추가하세요" items={advancedFeatures} onChange={setAdvancedFeatures} />

      <FileUploadField label="목록 썸네일 이미지" name="thumbnailUrl" />
      <TextField label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." />
      <TextField label="배포 URL" name="deployUrl" placeholder="https://..." />
      <TextField label="발표자료 URL" name="deckUrl" placeholder="https://slides.com/..." />
      <TextField label="README URL" name="readmeUrl" placeholder="https://github.com/.../blob/main/README.md" />

      <DemoAssetFields />
      <SectionImageFields />

      <TextArea label="아키텍처" name="architecture" placeholder="프로젝트 구조를 설명해주세요" />
      <TextArea label="코드리뷰" name="codeReview" placeholder="코드 설계, 개선 포인트, 리뷰 내용을 정리해주세요" />
      <TextArea label="트러블슈팅" name="troubleshooting" placeholder="프로젝트를 진행하며 해결한 문제들을 기록해보세요" />
      <TextArea label="회고" name="retrospective" placeholder="프로젝트를 마무리하며 느낀 점을 작성해보세요" />

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
        <Link href="/admin/dashboard" className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-bold text-white hover:bg-zinc-800">
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
