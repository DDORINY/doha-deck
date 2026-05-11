README.md 전체를 교체

# DOHA Deck

DOHA Deck은 개발 프로젝트의 발표자료, GitHub 링크, 배포 URL, 기술스택, 트러블슈팅, 회고를 한 곳에 정리하고 외부에 공유할 수 있는 개인 프로젝트 아카이브 CMS입니다.

이 프로젝트는 다중 사용자 플랫폼이 아니라, 관리자 1명이 프로젝트를 등록·수정·삭제하고 방문자는 공개된 프로젝트만 열람하는 구조입니다.

---

## 1. 프로젝트 개요

### 프로젝트명

DOHA Deck

### 프로젝트 목적

개발자가 자신의 프로젝트 자료를 체계적으로 정리하고, 포트폴리오 형태로 외부에 공유할 수 있는 웹 서비스를 만드는 것을 목표로 합니다.

### 주요 기능

#### 방문자 기능

- 공개 프로젝트 목록 조회
- 공개 프로젝트 상세 조회
- 발표 모드 조회
- 기술스택 기반 필터
- 프로젝트 검색
- GitHub 링크 이동
- 배포 링크 이동
- 발표자료 링크 이동
- README 링크 이동

#### 관리자 기능

- 관리자 로그인
- 관리자 대시보드 조회
- 프로젝트 등록
- 프로젝트 수정
- 프로젝트 삭제
- 공개 / 비공개 설정
- 기술스택 관리
- GitHub 링크 관리
- 배포 링크 관리
- 발표자료 링크 관리
- README 링크 관리
- 주요 기능 작성
- 아키텍처 작성
- 트러블슈팅 작성
- 회고 작성

---

## 2. 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Deploy | Vercel |
| Auth | 관리자 단일 로그인 구조 |

---

## 3. 프로젝트 구조

```txt
doha-deck/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ projects/
│  │  ├─ page.tsx
│  │  └─ [projectId]/
│  │     ├─ page.tsx
│  │     └─ present/
│  │        └─ page.tsx
│  └─ admin/
│     ├─ login/
│     │  └─ page.tsx
│     ├─ dashboard/
│     │  └─ page.tsx
│     └─ projects/
│        ├─ new/
│        │  └─ page.tsx
│        └─ [projectId]/
│           └─ edit/
│              └─ page.tsx
│
├─ components/
├─ features/
├─ lib/
├─ prisma/
│  └─ schema.prisma
├─ public/
├─ types/
├─ docs/
└─ README.md

4. 실행 방법
패키지 설치
npm install
개발 서버 실행
npm run dev

브라우저에서 아래 주소로 접속합니다.

http://localhost:3000
5. 환경 변수

프로젝트 루트에 .env 또는 .env.local 파일을 생성하고 아래 값을 설정합니다.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

DATABASE_URL=
DIRECT_URL=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
JWT_SECRET=

실제 환경 변수 파일은 GitHub에 올리지 않습니다.

환경 변수 예시는 .env.example 파일을 참고합니다.

6. Prisma 설정
Prisma Client 생성
npx prisma generate
DB 스키마 반영
npx prisma db push
Prisma Studio 실행
npx prisma studio
7. 주요 라우트
공개 페이지
경로	설명
/	랜딩 페이지
/projects	공개 프로젝트 목록
/projects/[projectId]	프로젝트 상세
/projects/[projectId]/present	발표 모드
관리자 페이지
경로	설명
/admin/login	관리자 로그인
/admin/dashboard	관리자 대시보드
/admin/projects/new	프로젝트 등록
/admin/projects/[projectId]/edit	프로젝트 수정
8. API 구조
Method	Endpoint	설명
GET	/api/auth	관리자 세션 확인
POST	/api/auth	관리자 로그인
DELETE	/api/auth	로그아웃
GET	/api/projects	공개 프로젝트 목록 조회
POST	/api/projects	프로젝트 등록
GET	/api/projects/[projectId]	프로젝트 상세 조회
PATCH	/api/projects/[projectId]	프로젝트 수정
DELETE	/api/projects/[projectId]	프로젝트 삭제
9. 배포

이 프로젝트는 Vercel 배포를 기준으로 합니다.

배포 시 Vercel 프로젝트 설정의 Environment Variables에 아래 값을 등록해야 합니다.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
JWT_SECRET=

GitHub 저장소와 Vercel을 연결하면 main 브랜치에 push할 때 자동으로 재배포됩니다.

10. 고도화 예정 기능
Supabase Storage 기반 파일 업로드
프로젝트 썸네일 이미지 업로드
발표자료 PDF / PPT 업로드
README 자동 생성
AI 발표 대본 생성
프로젝트별 SEO 설정
sitemap.xml / robots.txt 생성
프로젝트 데이터 JSON 내보내기
트러블슈팅 구조화 관리
11. 제외 기능

DOHA Deck은 개인 전용 프로젝트 아카이브 CMS이므로 아래 기능은 포함하지 않습니다.

일반 사용자 회원가입
일반 사용자 로그인
다중 사용자 대시보드
댓글
좋아요
팔로우
채팅
알림
결제
팀 협업 기능
방문자 파일 업로드

교체 후 커밋:

```powershell
git add README.md
git commit -m "docs: update README in Korean"
git push