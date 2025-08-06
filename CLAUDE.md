# CLAUDE.md

이 파일은 이 저장소의 코드와 작업할 때 Claude Code (claude.ai/code)에게 지침을 제공합니다.

## 개발 명령어

### 핵심 명령어
- `npm run dev` - 포트 3100에서 Turbopack을 사용한 개발 서버 시작
- `npm run build` - 프로덕션 번들 빌드
- `npm start` - 프로덕션 서버 시작
- `npm run lint` - 코드 품질 검사를 위한 ESLint 실행

### 개발 서버
이 프로젝트는 더 빠른 개발 빌드를 위해 Turbopack이 활성화된 포트 3100(기본값 3000이 아님)에서 실행됩니다. http://localhost:3100 에서 접근하세요.

## 아키텍처 개요

### 기술 스택
- **Next.js 15** with App Router 아키텍처
- **React 19** UI 컴포넌트용
- **TypeScript** 타입 안전성을 위한
- **Tailwind CSS v4** 스타일링용 (PostCSS 플러그인을 통해)
- **Geist 폰트** (Sans 및 Mono) next/font를 통해 최적화

### 프로젝트 구조
```
app/                    # App Router 디렉토리 (Next.js 13+ 구조)
├── layout.tsx         # 폰트 구성이 포함된 루트 레이아웃
├── page.tsx           # 홈 페이지 컴포넌트
└── globals.css        # 전역 스타일 및 Tailwind 임포트

public/                # 정적 자원
├── *.svg              # 아이콘 자원 (file, globe, next, vercel, window)

설정 파일들:
├── next.config.ts     # Next.js 설정
├── tsconfig.json      # @/* 경로 매핑을 포함한 TypeScript 설정
├── eslint.config.mjs  # Next.js + TypeScript 규칙이 포함된 ESLint
└── postcss.config.mjs # Tailwind CSS v4 플러그인이 포함된 PostCSS
```

### 주요 아키텍처 패턴

#### App Router 구조
이 프로젝트는 Next.js App Router(Pages Router가 아님)를 사용합니다. 모든 라우트는 `app/` 디렉토리에 정의됩니다:
- `app/layout.tsx` - 모든 페이지에 적용되는 루트 레이아웃
- `app/page.tsx` - 홈 페이지 (`/`에 매핑)
- 향후 라우트는 `app/[route]/page.tsx` 패턴을 따라야 합니다

#### 폰트 최적화
폰트는 `layout.tsx`에서 Geist 폰트와 함께 `next/font/google`을 사용하여 구성됩니다:
- 변수: `--font-geist-sans` 및 `--font-geist-mono`
- body className의 CSS 변수를 통해 전역적으로 적용

#### 스타일링 시스템
- **Tailwind CSS v4** PostCSS 플러그인을 통해 구성
- CSS 커스텀 프로퍼티와 같은 최신 기능 사용
- `dark:` 접두사를 통해 구현된 다크 모드 지원
- 유틸리티 우선 접근 방식을 따르는 컴포넌트 스타일링

#### TypeScript 설정
- 더 나은 타입 안전성을 위한 strict 모드 활성화
- 경로 매핑 설정: `@/*`는 `./src/*`에 매핑 (현재 src/ 사용하지 않음)
- 향상된 IDE 지원을 위한 Next.js TypeScript 플러그인 활성화

### 개발 패턴

#### 컴포넌트 구조
현재 홈 페이지는 다음을 보여줍니다:
- 반응형 그리드 레이아웃 (`grid md:grid-cols-3`)
- 그라데이션 배경 및 텍스트 효과
- 글래스모피즘 효과 (`backdrop-blur-sm`)
- 호버 애니메이션 및 전환
- 다크 모드 반응형 디자인

#### 코드 컨벤션
- 컴포넌트 props를 위한 TypeScript 인터페이스
- CSS 모듈 사용하지 않음 - Tailwind 유틸리티 선호
- 최적화된 이미지를 위한 Next.js Image 컴포넌트
- 접근성을 고려한 시맨틱 HTML 구조

### 환경 참고사항
- 개발 서버는 더 빠른 빌드를 위해 Turbopack 사용
- 현재 커스텀 도메인이나 API 라우트는 구성되지 않음
- 기본 Next.js 개발 및 프로덕션 최적화 적용