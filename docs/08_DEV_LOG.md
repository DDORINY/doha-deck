# 개발 일지

## 2026-05-09

### 작업 내용

- DOHA Deck 프로젝트 기획
- Next.js 프로젝트 생성
- 메인 UI 구현
- 프로젝트 목록 UI 구현
- 프로젝트 상세 UI 구현
- 발표 모드 UI 구현
- 관리자 프로젝트 등록 UI 구현
- 관리자 대시보드 UI 구현
- 프로젝트 수정/삭제 UI 구현
- Supabase 프로젝트 생성
- Prisma 연결
- Prisma schema 작성
- DB push 성공
- 관리자 seed 작성 및 관리자 계정 생성

### 오늘 추가 구현

- `/api/auth` 인증 API 구현
  - `GET`: 관리자 세션 확인
  - `POST`: 관리자 로그인
  - `DELETE`: 로그아웃
- HTTP-only 쿠키 기반 관리자 세션 처리 구현
- HMAC SHA-256 기반 JWT 서명 처리 구현
- `/api/projects` 프로젝트 목록/등록 API 구현
- `/api/projects/[projectId]` 프로젝트 상세/수정/삭제 API 구현
- `/api/files` 시연 파일 확인용 API 구현
- 공개 프로젝트 목록을 API 기반으로 연결
- 공개 프로젝트 상세를 API 기반으로 연결
- 발표 모드를 DB 프로젝트 데이터 기반으로 연결
- 관리자 로그인 페이지를 실제 API와 연결
- 관리자 대시보드를 실제 API와 연결
- 프로젝트 등록 폼을 실제 API와 연결
- 프로젝트 수정/삭제 폼을 실제 API와 연결
- 공개 페이지 헤더에서 로그인 상태일 때 `관리자 로그인` 대신 관리자 이름 표시
- 발표 모드에서는 파일 업로드/영상 링크 입력 UI가 보이지 않도록 정리
- 파일 업로드/YouTube 링크 입력 UI는 관리자 등록/수정 화면에만 유지

### 해결한 문제

- Turbopack 개발 서버에서 `@/components/layout/Header` alias를 찾지 못하는 문제 해결
- API 응답이 비어 있거나 에러일 때 `response.json()` 호출로 화면이 깨지는 문제 해결
- Supabase Pooler 연결에서 Prisma prepared statement가 충돌하는 문제 해결
- 관리자 세션 조회 중 Prisma 오류가 페이지 전체를 중단시키는 문제 해결
- 일부 문서와 화면에 남아 있던 깨진 한글 문구 정리

### 검증

- `npm run lint` 통과
- `npm run build` 통과
- `/api/auth` 정상 응답 확인
- `/api/projects` 정상 응답 확인
- 실제 DB 테이블 확인
  - `Admin`
  - `Project`
  - `ProjectStack`

### 다음 작업

- 관리자 등록/수정 화면의 시연 파일 영구 저장 방식 결정
- YouTube 시연 영상 URL을 DB schema에 정식 필드로 추가할지 검토
- 프로젝트 썸네일 업로드 또는 자동 생성 기능 검토
- 비공개 프로젝트 접근 UX 개선
- 관리자 페이지 모바일 레이아웃 보완
