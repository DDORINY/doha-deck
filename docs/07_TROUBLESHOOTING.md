# 트러블슈팅 기록

## 1. Prisma datasource url 오류

### 증상

Prisma 실행 시 datasource url 관련 오류가 발생했다.

### 원인

Next.js/Prisma 버전에 맞는 datasource 설정과 환경 변수 형식이 맞지 않았다.

### 해결

`prisma/schema.prisma`에서 Supabase PostgreSQL datasource를 다음 구조로 정리했다.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 2. Supabase DB 비밀번호 특수문자 인코딩 문제

### 증상

DB 연결 문자열에 비밀번호를 넣었을 때 연결이 실패했다.

### 원인

비밀번호에 포함된 특수문자가 URL에서 그대로 해석되었다.

### 해결

비밀번호를 URL encode해서 `DATABASE_URL`, `DIRECT_URL`에 반영했다.

## 3. Supabase Pooler username 문제

### 증상

Supabase Pooler 연결 시 user/tenant 관련 오류가 발생했다.

### 원인

Pooler 연결 문자열에서 username 형식이 Supabase 요구 형식과 달랐다.

### 해결

Supabase Dashboard에서 제공하는 Pooler connection string을 기준으로 다시 설정했다.

## 4. P1000 Authentication failed

### 증상

Prisma가 DB 인증에 실패했다.

### 원인

DB 비밀번호 또는 연결 문자열이 잘못되었다.

### 해결

Supabase DB 비밀번호를 재확인하고 `.env`, `.env.local`의 값을 동일하게 정리했다.

## 5. P1013 empty host in database URL

### 증상

Prisma가 DB URL의 host를 읽지 못했다.

### 원인

환경 변수 값이 비어 있거나 shell 명령으로 `.env`를 작성하는 과정에서 문자열이 깨졌다.

### 해결

`.env`, `.env.local`을 직접 점검하고 실제 connection string만 남기도록 정리했다.

## 6. ENOTFOUND tenant/user not found

### 증상

DB host 또는 tenant/user를 찾을 수 없다는 오류가 발생했다.

### 원인

Supabase project ref, Pooler host, username 중 하나가 잘못 입력되었다.

### 해결

Supabase Dashboard에서 connection string을 다시 복사해 적용했다.

## 7. Next.js Turbopack module not found

### 증상

개발 서버에서 다음 오류가 발생했다.

```text
Module not found: Can't resolve '@/components/layout/Header'
```

### 원인

개발 서버의 import map이 alias 경로를 제대로 해석하지 못했다.

### 해결

`app/layout.tsx`의 Header import를 alias 대신 상대 경로로 변경했다.

```ts
import Header from "../components/layout/Header";
```

## 8. Response JSON 파싱 오류

### 증상

관리자 대시보드 또는 프로젝트 목록에서 다음 오류가 발생했다.

```text
Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

### 원인

API가 401/500/빈 응답을 반환했는데 프론트에서 바로 `response.json()`을 호출했다.

### 해결

응답을 `text()`로 먼저 받은 뒤, 내용이 있을 때만 JSON parsing하도록 변경했다.

대상 화면:

- `app/admin/dashboard/page.tsx`
- `app/projects/ProjectsList.tsx`

## 9. Prisma prepared statement 충돌

### 증상

관리자 세션 조회 또는 DB 쿼리 실행 시 다음 오류가 발생했다.

```text
prepared statement "s0" already exists
```

### 원인

Supabase Pooler/PgBouncer 연결에서 Prisma prepared statement가 충돌했다.

### 해결

Prisma Client 생성 시 `DATABASE_URL`에 다음 옵션을 자동으로 추가하도록 처리했다.

- `pgbouncer=true`
- `connection_limit=1`

적용 파일:

- `lib/prisma.ts`
- `prisma/seed.ts`

## 10. 관리자 세션 조회 중 Prisma 오류

### 증상

`getAdminSession()` 내부의 `prisma.admin.findUnique()`에서 오류가 나면 페이지 전체가 런타임 에러로 중단되었다.

### 해결

`getAdminSession()`에서 Prisma 조회를 `try/catch`로 감싸고, 실패 시 `null`을 반환하도록 수정했다.

이후 화면은 로그인되지 않은 상태로 처리된다.
