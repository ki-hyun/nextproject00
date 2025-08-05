# 로그인 시스템 설정 가이드

## 1. 데이터베이스 설정

### PostgreSQL 설치 및 설정
1. PostgreSQL을 설치하세요
2. 데이터베이스를 생성하세요
3. `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

## 2. 의존성 설치

```bash
npm install
```

## 3. 데이터베이스 마이그레이션

```bash
npx prisma generate
npx prisma db push
```

## 4. 개발 서버 실행

```bash
npm run dev
```

## 5. 사용 방법

### 회원가입
1. `/register` 페이지로 이동
2. 사용자명, 이메일, 비밀번호 입력
3. 회원가입 완료

### 로그인
1. `/login` 페이지로 이동
2. 이메일과 비밀번호 입력
3. 로그인 성공 시 홈페이지로 리다이렉트

### 로그아웃
1. 상단 네비게이션의 "로그아웃" 버튼 클릭

## 6. 기능

- ✅ 사용자 회원가입
- ✅ 사용자 로그인
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ 이메일 중복 확인
- ✅ 사용자명 중복 확인
- ✅ 폼 유효성 검사
- ✅ 에러 처리
- ✅ 로딩 상태 표시
- ✅ 반응형 디자인
- ✅ 소셜 로그인 버튼 (UI만 구현)

## 7. 보안 고려사항

현재 구현된 기능:
- 비밀번호 해싱 (bcrypt)
- 입력 유효성 검사
- 에러 메시지 처리

추가로 구현해야 할 기능:
- JWT 토큰 인증
- 세션 관리
- CSRF 보호
- Rate limiting
- 실제 소셜 로그인 연동

## 8. 파일 구조

```
app/
├── api/
│   └── auth/
│       ├── login/
│       │   └── route.ts
│       └── register/
│           └── route.ts
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
└── page.tsx

components/
├── Navigation.tsx
└── TabNavigation.tsx

prisma/
└── schema.prisma
``` 