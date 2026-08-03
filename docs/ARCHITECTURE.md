# 아키텍처

## 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router, TypeScript, `create-next-app@latest`가 설치한 최신 버전) | 프론트+백엔드(Server Actions, Route Handlers)를 한 프로젝트에서 처리해 Docker 컨테이너 1개로 단순하게 배포 가능. `params`/`searchParams`가 Promise인 등 Next 15/16의 async API 변경을 그대로 따름 |
| 스타일 | Tailwind CSS | 기성 유틸리티로 빠르게, 커스텀 CSS 유지보수 부담 없이. 디자인 감각보다 UX 판단이 중요한 과제 특성과 맞음 |
| DB / BaaS | Supabase (PostgreSQL) | 지정된 요구사항. `@supabase/supabase-js`로 클라이언트에서 직접 CRUD, 별도 백엔드 서버 불필요 |
| 배포 | Docker (단일 Next.js standalone 컨테이너) | 요구사항: `docker-compose up` 1회 실행. DB는 Supabase 클라우드를 쓰므로 컨테이너는 앱 1개만 있으면 충분 |

## 왜 Supabase 클라우드 (self-host 아님)

- Supabase self-hosted는 컨테이너 10개+ (Postgres/GoTrue/Kong/Studio/Realtime 등)로 무겁고, 심사자 환경에서 기동 시간·리소스 부담이 큼
- `anon key`(Supabase 신규 키 체계에서는 `sb_publishable_...`)는 브라우저 노출을 전제로 설계된 공개용 키이며, 실제 접근 제어는 RLS(Row Level Security)가 담당 → `.env.example`에 anon/publishable key + project URL을 그대로 포함해도 안전
- `service_role key`(신규 체계의 `sb_secret_...`, RLS 우회 관리자 권한)는 절대 커밋하지 않음 — 이번 프로젝트에서는 사용하지 않음(anon/publishable key로 충분)

## 인증

- 이번 과제 범위에서 로그인 없음 (단일 사용자 가정, [PROJECT.md](PROJECT.md) 참고)
- RLS는 `anon` role에 대해 전체 CRUD 허용 — **데모/과제용 단순화이며 실서비스라면 `auth.uid()` 기반 정책 필요**. README에도 명시.

## 읽기/쓰기 구현 방식: Server Actions 우선

- 조회는 Server Component에서 `lib/entries.ts`, `lib/orders.ts`의 함수를 직접 호출 (별도 API 계층 없이 DB까지 한 번에)
- 생성/수정/삭제는 App Router **Server Actions** (`"use server"`)로 구현 — `entries/actions.ts`, `orders/actions.ts`. React 19의 `useActionState`로 폼 에러·로딩 상태를 자연스럽게 다룸
- Route Handler(`app/api/.../route.ts`)는 두 곳에만 사용: ① 주문 작성 화면에서 기간별 일기 수를 실시간으로 미리 보여주는 `GET /api/entries/count`, ② 관리자 화면의 `GET /api/orders/export` (CSV 다운로드) — 둘 다 "클라이언트가 fetch로 호출해야 하는" 성격이라 Server Action이 아닌 Route Handler가 적합
- 이 구조로도 "프론트+백엔드"라는 풀스택 요구사항을 만족함 — Server Actions/Route Handlers가 실질적인 백엔드 레이어

## Docker 빌드와 DB 연결을 분리하는 이유

- 모든 DB 연동 페이지는 `export const dynamic = "force-dynamic"`으로 빌드 시점 프리렌더링을 하지 않음
- Supabase 클라이언트(`lib/supabase.ts`)는 모듈 로드 시점이 아니라 **실제 쿼리 실행 시점에 지연 생성** — `docker build` 단계(`npm run build`)에서 `SUPABASE_URL`/`SUPABASE_ANON_KEY`가 없어도 빌드가 깨지지 않음
- 값은 컨테이너 **실행 시점**에 `docker-compose`가 `.env`를 읽어 주입 (`env_file`) — 빌드와 런타임의 관심사를 분리

## 디렉터리 구조

```
SweetBook/
├── docs/                        # 프로젝트 문서
│   ├── REQUIREMENTS.md
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   └── PROGRESS.md
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── supabase/
│   ├── schema.sql               # 테이블 + Storage 버킷 + RLS 정책 (전체, 재실행 가능)
│   ├── seed.sql                  # 더미 데이터
│   └── migrations/               # 기존 DB에 적용하는 증분 패치 (예: 0002_add_entry_photos.sql)
├── src/
│   ├── app/
│   │   ├── layout.tsx, globals.css   # 루트 레이아웃 — html/body/폰트만, 화면별 chrome 없음
│   │   ├── error.tsx, not-found.tsx  # 전역 fallback (모든 라우트 그룹에 공통 적용)
│   │   ├── (app)/                    # 사용자용 화면 — NavBar + max-w-2xl 레이아웃 (URL엔 안 드러남)
│   │   │   ├── layout.tsx            # NavBar 렌더링
│   │   │   ├── page.tsx              # 홈 (스트릭 + 오늘 상태 + 최근 일기)
│   │   │   ├── entries/
│   │   │   │   ├── page.tsx          # 목록 + 감정 필터(좋았던/힘든 하루)
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── actions.ts        # Server Actions (create/update/delete)
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx, [id]/edit/page.tsx
│   │   │   ├── calendar/page.tsx, loading.tsx
│   │   │   └── orders/
│   │   │       ├── page.tsx, loading.tsx, actions.ts
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx            # 운영자 전용 레이아웃 — NavBar 없음, max-w-6xl로 더 넓게
│   │   │   └── orders/page.tsx       # 상태 변경 + CSV 내보내기
│   │   └── api/
│   │       ├── entries/count/route.ts
│   │       └── orders/export/route.ts
│   ├── components/               # NavBar, EntryForm, OrderForm, AudioPlayer, 뱃지류 등
│   └── lib/
│       ├── supabase.ts           # 지연 생성 클라이언트
│       ├── entries.ts, orders.ts # 데이터 접근 함수
│       ├── storage.ts            # 사진·음원 업로드/삭제/공개 URL (Supabase Storage)
│       ├── types.ts, format.ts, streak.ts, id.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## DB 스키마

### `entries` (감정일기)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid, pk | `gen_random_uuid()` |
| entry_date | date, unique, not null | 하루 1건 제약 |
| gratitude_items | text[], not null | 오늘 있었던 일 최대 3개 (컬럼명은 초기 "감사일기" 시절 그대로 유지 — [PROJECT.md](PROJECT.md) 참고) |
| mood | text | 감정 태그, 긍정 8종(`thankful`\|`joy`\|`calm`\|`proud`\|`excited`\|`happy`\|`relieved`\|`loving`) + 부정 8종(`sad`\|`angry`\|`anxious`\|`tired`\|`down`\|`lonely`\|`frustrated`\|`regretful`) |
| note | text | 자유 메모, 선택 |
| photo_path | text, nullable | Storage 버킷(`entry-photos`) 내 오브젝트 경로. 사진 없으면 null |
| audio_path | text, nullable | Storage 버킷(`entry-audio`) 내 오브젝트 경로. 음원 없으면 null |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### Storage: `entry-photos`, `entry-audio` 버킷

- 둘 다 public 버킷 (공개 읽기). `entry-photos`는 5MB 제한 + `image/jpeg|png|webp|gif`, `entry-audio`는 20MB 제한 + `audio/mpeg|mp3|mp4|x-m4a|wav|ogg`만 허용 (버킷 설정 + 업로드 시 앱 단에서 이중 검증)
- 업로드/삭제는 `entries` 테이블과 동일하게 RLS로 `anon` role 허용 (`supabase/schema.sql` 하단 참고)
- 사진·음원 교체/삭제/일기 삭제 시 이전 오브젝트를 함께 정리해 orphan 파일이 남지 않도록 `src/app/(app)/entries/actions.ts`에서 처리
- 음원은 사용자가 직접 올린 파일만 지원 (멜론/Spotify 등 스트리밍 서비스 연동은 하지 않음 — 이유는 [PROJECT.md](PROJECT.md) 참고). 상세 페이지 진입 시 `<audio autoplay>` 재생을 시도하되, 브라우저 자동재생 정책으로 막히면 재생 버튼으로 대체 (`src/components/AudioPlayer.tsx`)

### `orders` (책 제작 주문)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid, pk | `gen_random_uuid()` |
| title | text, not null | 책 제목 |
| start_date | date, not null | 포함 기간 시작 |
| end_date | date, not null | 포함 기간 끝 |
| entry_count | int, not null | 주문 시점 계산된 포함 일기 수 |
| status | text, not null | 'pending'\|'processing'\|'completed', default 'pending' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 환경변수

모든 Supabase 호출이 서버(Server Component/Action/Route Handler)에서만 일어나므로
`NEXT_PUBLIC_` 접두사가 필요 없다 — 브라우저 번들에 값을 심을 필요가 없고,
`docker build` 시점에 값을 넘겨줄 필요도 없어져 Docker 설정이 단순해진다.

| 변수 | 설명 |
|---|---|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | Supabase anon(public) key |
| `PORT` | 호스트에 노출할 포트 (docker-compose가 `.env`에서 읽음, 기본 3000) |

## 진행 상황

세션 간 이어서 작업할 때는 [PROGRESS.md](PROGRESS.md)를 먼저 확인.
