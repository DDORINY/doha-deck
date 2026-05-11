# 트러블슈팅 기록

## 1. Prisma datasource URL 오류

### 증상

Prisma 실행 시 datasource URL 관련 오류가 발생했다.

### 원인

Next.js/Prisma 버전에 맞는 datasource 설정과 환경 변수 형식이 맞지 않았다.

### 해결

`prisma/schema.prisma`에서 Supabase PostgreSQL datasource를 아래 구조로 정리했다.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 2. Supabase DB 비밀번호 특수문자 인코딩

### 증상

DB 연결 문자열에 비밀번호를 넣었지만 연결이 실패했다.

### 원인

비밀번호에 포함된 특수문자가 URL에서 그대로 해석되었다.

### 해결

비밀번호를 URL encode해서 `DATABASE_URL`, `DIRECT_URL`에 반영했다.

## 3. Supabase Pooler username 문제

### 증상

Supabase Pooler 연결 시 user/tenant 관련 오류가 발생했다.

### 원인

Pooler 연결 문자열의 username 형식이 Supabase 요구 형식과 달랐다.

### 해결

Supabase Dashboard에서 제공하는 Pooler connection string을 기준으로 다시 설정했다.

## 4. P1000 Authentication failed

### 증상

Prisma가 DB 인증에 실패했다.

### 원인

DB 비밀번호 또는 연결 문자열이 잘못되어 있었다.

### 해결

Supabase DB 비밀번호를 재확인하고 `.env`, `.env.local` 값을 일관되게 정리했다.

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

개발 서버에서 아래 오류가 발생했다.

```text
Module not found: Can't resolve '@/components/layout/Header'
```

### 원인

Turbopack 개발 서버의 import map에서 alias 경로를 제대로 해석하지 못했다.

### 해결

API와 layout 주변 import를 상대 경로로 정리했다.

## 8. Response JSON 파싱 오류

### 증상

관리자 대시보드 또는 프로젝트 목록에서 아래 오류가 발생했다.

```text
Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

### 원인

API가 500 또는 빈 응답으로 중단되는데 프론트엔드에서 바로 `response.json()`을 호출했다.

### 해결

API Route에서 예외를 `try/catch`로 감싸고 JSON 형식의 에러 응답을 반환하도록 정리했다. 개발 환경에서는 `error.message`를 응답에 포함하고, 운영 환경에서는 내부 에러를 숨긴다.

## 9. Prisma prepared statement 충돌

### 증상

Supabase Pooler 환경에서 아래 오류가 발생할 수 있다.

```text
prepared statement "s0" already exists
```

### 원인

Supabase Pooler/PgBouncer 연결에서 Prisma prepared statement가 충돌할 수 있다.

### 해결

애플리케이션 코드에서 `DATABASE_URL`을 직접 조작하지 않고 Prisma 기본 환경 변수 로딩을 사용하도록 `lib/prisma.ts`를 단순화했다. Pooler 옵션이 필요하면 코드에서 붙이지 않고 실제 `DATABASE_URL` 값에 명시한다.

예시:

```text
postgresql://...?pgbouncer=true&connection_limit=1
```

## 10. API Route 500 오류

### 증상

직접 Prisma 조회는 정상인데 Next API Route에서 아래 요청들이 500으로 실패했다.

- `POST /api/auth`
- `GET /api/projects`

### 원인

Prisma Client 초기화, 인증 쿠키/JWT 처리, Route Handler 예외 처리가 한 곳에서 정리되어 있지 않아 서버 예외가 빈 응답으로 이어졌다.

### 해결

- `lib/prisma.ts`에 `globalThis` 기반 PrismaClient 캐싱을 적용했다.
- `lib/auth.ts`에 관리자 토큰 생성/검증, 쿠키 설정/삭제, 관리자 조회 함수를 정리했다.
- API Route에서 관리자 없음은 401로 반환하고, 서버 오류는 통일된 JSON 응답으로 반환하도록 정리했다.
- `JWT_SECRET`을 환경 변수 목록에 추가했다. 값이 없으면 `ADMIN_PASSWORD`를 임시 fallback으로 사용하지만, 운영 환경에서는 별도 `JWT_SECRET`을 설정하는 것을 권장한다.
