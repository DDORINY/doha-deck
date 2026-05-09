# API 명세

## 1. 인증 API

### GET /api/auth

현재 관리자 세션 상태를 확인한다.

응답:

```json
{
  "authenticated": true,
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "DOHA"
  }
}
```

### POST /api/auth

관리자 로그인을 처리한다.

요청:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

성공 시 `doha_admin_session` HTTP-only 쿠키를 발급한다.

### DELETE /api/auth

관리자 세션 쿠키를 삭제하고 로그아웃한다.

## 2. 프로젝트 API

### GET /api/projects

공개 프로젝트 목록을 조회한다.

Query:

- `q`: 제목, 한 줄 소개, 상세 설명 검색어
- `stack`: 기술스택 필터

### GET /api/projects?includePrivate=1

관리자 전용 프로젝트 목록을 조회한다. 공개/비공개 프로젝트와 대시보드 통계를 함께 반환한다.

관리자 세션이 없으면 `401`을 반환한다.

### POST /api/projects

관리자 전용 프로젝트 등록 API.

요청 주요 필드:

- `title`
- `summary`
- `description`
- `githubUrl`
- `deployUrl`
- `deckUrl`
- `readmeUrl`
- `visibility`: `PUBLIC` 또는 `PRIVATE`
- `stacks`: 문자열 배열
- `features`: 문자열 배열
- `architecture`
- `troubleshooting`
- `retrospective`

### GET /api/projects/[projectId]

프로젝트 상세를 조회한다. `projectId`는 `id` 또는 `slug` 모두 허용한다.

비공개 프로젝트는 관리자 세션이 있을 때만 조회할 수 있다.

### PATCH /api/projects/[projectId]

관리자 전용 프로젝트 수정 API. 등록 API와 같은 형태의 데이터를 받는다.

수정 시 기술스택은 기존 값을 삭제하고 요청 배열 기준으로 다시 생성한다.

### DELETE /api/projects/[projectId]

관리자 전용 프로젝트 삭제 API.

프로젝트 삭제 시 `ProjectStack`은 Prisma relation의 `onDelete: Cascade`로 함께 삭제된다.

## 3. 파일 API

### POST /api/files

관리자 등록/수정 화면에서 시연 파일을 선택했을 때 파일 메타데이터를 확인한다.

현재 구현은 실제 영구 저장이 아니라 미리보기/검증용 응답만 반환한다.

## 4. 응답 규칙

- 성공 응답은 JSON으로 반환한다.
- 인증이 필요한 API에서 세션이 없으면 `401`을 반환한다.
- 존재하지 않는 프로젝트는 `404`를 반환한다.
- 필수 입력값이 누락되면 `400`을 반환한다.
