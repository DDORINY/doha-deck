# 배포 문서

## 1. 배포 구조

- Frontend / Backend: Vercel
- DB: Supabase PostgreSQL
- ORM: Prisma
- Runtime: Next.js App Router Route Handler

## 2. 필수 환경 변수

로컬과 Vercel 환경에 다음 변수를 설정한다.

```env
DATABASE_URL=
DIRECT_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
JWT_SECRET=
```

`JWT_SECRET`은 운영 환경에서 반드시 별도로 설정한다.

## 3. Supabase DB 설정

Supabase PostgreSQL을 사용한다.

Prisma schema 기준 테이블:

- `Admin`
- `Project`
- `ProjectStack`

DB 생성 후 아래 명령으로 스키마를 적용한다.

```bash
npx prisma db push
```

관리자 계정은 seed로 생성한다.

```bash
npx prisma db seed
```

또는 프로젝트 설정에 따라 `npx tsx prisma/seed.ts`를 사용한다.

## 4. Prisma Pooler 주의사항

Supabase Pooler 또는 PgBouncer 계열 연결에서는 prepared statement 충돌이 발생할 수 있다.

현재 앱은 `lib/prisma.ts`에서 `DATABASE_URL`에 다음 옵션을 자동 보정한다.

- `pgbouncer=true`
- `connection_limit=1`

이 설정은 `prepared statement "s0" already exists` 오류를 피하기 위한 처리다.

## 5. Vercel 배포 절차

1. GitHub 저장소를 Vercel에 연결한다.
2. Environment Variables에 필수 환경 변수를 등록한다.
3. Supabase DB에 Prisma schema를 적용한다.
4. 관리자 seed를 실행한다.
5. Vercel에서 배포를 실행한다.

## 6. 배포 후 확인 항목

- `/` 메인 페이지가 정상 표시되는지 확인
- `/projects` 공개 프로젝트 목록 API가 정상 동작하는지 확인
- `/admin/login` 관리자 로그인이 가능한지 확인
- `/admin/dashboard`에서 프로젝트 목록과 통계가 보이는지 확인
- 프로젝트 등록, 수정, 삭제가 정상 동작하는지 확인
- 비공개 프로젝트가 방문자에게 노출되지 않는지 확인
