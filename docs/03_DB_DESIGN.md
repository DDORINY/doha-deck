# DB 설계

## 1. 사용 DB

Supabase PostgreSQL

## 2. ORM

Prisma

## 3. 테이블 목록

- `Admin`
- `Project`
- `ProjectStack`

## 4. Admin

관리자 계정 정보를 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `String` | UUID 기본키 |
| `email` | `String` | 관리자 이메일, unique |
| `passwordHash` | `String` | bcrypt 해시 비밀번호 |
| `name` | `String` | 관리자 표시 이름 |
| `createdAt` | `DateTime` | 생성일 |
| `updatedAt` | `DateTime` | 수정일 |

## 5. Project

프로젝트 공개 페이지, 상세 페이지, 발표 모드에서 사용하는 핵심 데이터를 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `String` | UUID 기본키 |
| `title` | `String` | 프로젝트명 |
| `slug` | `String` | 공개 URL slug, unique |
| `summary` | `String` | 한 줄 소개 |
| `description` | `String` | 프로젝트 개요 |
| `thumbnailUrl` | `String?` | 목록 썸네일 이미지 URL |
| `githubUrl` | `String?` | GitHub 링크 |
| `deployUrl` | `String?` | 배포 링크 |
| `deckUrl` | `String?` | 발표자료 링크 |
| `readmeUrl` | `String?` | README 링크 |
| `demoYoutubeUrl` | `String?` | 시연 영상 YouTube URL |
| `demoFileUrl` | `String?` | 시연 파일 URL |
| `demoFileName` | `String?` | 시연 파일명 |
| `demoFileType` | `String?` | 시연 파일 MIME type |
| `demoFileSize` | `Int?` | 시연 파일 크기(byte) |
| `visibility` | `ProjectVisibility` | 공개/비공개 상태 |
| `features` | `String?` | 기존 주요 기능 JSON 문자열 |
| `basicFeatures` | `String?` | 기본 기능 JSON 문자열 |
| `advancedFeatures` | `String?` | 고도화 기능 JSON 문자열 |
| `architecture` | `String?` | 아키텍처 설명 |
| `codeReview` | `String?` | 코드리뷰 내용 |
| `troubleshooting` | `String?` | 트러블슈팅 내용 |
| `retrospective` | `String?` | 회고 |
| `overviewImageUrl` | `String?` | 프로젝트 개요 섹션 이미지 URL |
| `stacksImageUrl` | `String?` | 기술스택 섹션 이미지 URL |
| `featuresImageUrl` | `String?` | 주요 기능 섹션 이미지 URL |
| `architectureImageUrl` | `String?` | 아키텍처 섹션 이미지 URL |
| `codeReviewImageUrl` | `String?` | 코드리뷰 섹션 이미지 URL |
| `troubleshootingImageUrl` | `String?` | 트러블슈팅 섹션 이미지 URL |
| `retrospectiveImageUrl` | `String?` | 회고 섹션 이미지 URL |
| `createdAt` | `DateTime` | 생성일 |
| `updatedAt` | `DateTime` | 수정일 |

이미지와 시연 파일은 Supabase Storage에 업로드하고, DB에는 업로드 결과 URL과 메타데이터만 저장한다.

## 6. ProjectStack

프로젝트별 기술스택을 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `String` | UUID 기본키 |
| `projectId` | `String` | Project 외래키 |
| `name` | `String` | 기술스택 이름 |
| `category` | `String?` | 향후 분류용 필드 |
| `createdAt` | `DateTime` | 생성일 |
| `updatedAt` | `DateTime` | 수정일 |

`ProjectStack`은 `Project` 삭제 시 cascade로 함께 삭제된다.

## 7. 공개/비공개 정책

`Project.visibility` 값으로 공개 여부를 관리한다.

- `PUBLIC`: 방문자에게 노출
- `PRIVATE`: 관리자에게만 노출

공개 프로젝트 목록 API는 `PUBLIC` 프로젝트만 반환한다.

관리자 세션이 있는 경우 비공개 프로젝트도 상세/발표 모드에서 미리볼 수 있다.

## 8. 주요 기능 저장 정책

주요 기능은 아래 두 그룹으로 나누어 저장한다.

- `basicFeatures`: 기본 기능
- `advancedFeatures`: 고도화 기능

기존 `features` 필드는 이전 데이터 호환용으로 유지한다. 새 데이터 저장 시에는 기본 기능과 고도화 기능을 합친 값도 `features`에 함께 저장한다.

## 9. 파일 저장 정책

관리자 등록/수정 화면에서 파일을 선택하면 `/api/files`가 Supabase Storage에 업로드한다.

필요 환경변수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

기본 버킷명은 `project-assets`다. 상세/발표 화면에서 바로 파일을 볼 수 있도록 버킷은 public으로 생성한다.

업로드 후 저장되는 값:

- 이미지: 각 섹션의 `*ImageUrl` 필드
- 썸네일: `thumbnailUrl`
- 시연 파일: `demoFileUrl`, `demoFileName`, `demoFileType`, `demoFileSize`

## 10. 향후 확장 테이블

- `ProjectFile`
- `ProjectLink`
- `ProjectSection`
- `ProjectTroubleshooting`
