# EcoLife 자동화 환경 웹사이트 설정 가이드

## 📋 프로젝트 개요

완전 자동화된 환경 콘텐츠 웹사이트로, 5단계 개발 과정을 통해 구축되었습니다:

- **Phase 1**: Next.js 기본 구조 (SEO 최적화)
- **Phase 2**: 자동 콘텐츠 수집 (RSS, API, 웹스크래핑)
- **Phase 3**: AI 콘텐츠 생성 (OpenAI GPT-4)
- **Phase 4**: 자동 발행 및 최적화 (소셜미디어, 이메일, A/B테스트)
- **Phase 5**: 수익 최적화 (AdSense, 제휴마케팅, 분석)

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 API 키들을 설정하세요.

### 3. 데이터베이스 초기화

```bash
npx prisma generate
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 🔧 시스템 테스트

각 단계별 시스템을 테스트할 수 있습니다:

```bash
# Phase 2: 콘텐츠 수집 시스템
npx tsx src/scripts/test-phase2.ts

# Phase 3: AI 콘텐츠 생성
npx tsx src/scripts/test-phase3.ts

# Phase 4: 자동 발행 시스템
npx tsx src/scripts/test-phase4.ts

# Phase 5: 수익 최적화
npx tsx src/scripts/test-phase5.ts
```

## 🛠️ 필수 설정

### Google Services

1. **Google Analytics**
   - GA4 속성 생성
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` 설정

2. **Google AdSense**
   - AdSense 계정 생성 및 승인
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID` 설정

3. **Google Ads** (선택사항)
   - 전환 추적을 위한 `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID`

### AI 콘텐츠 생성

- **OpenAI API**: GPT-4 액세스 권한 필요
- `OPENAI_API_KEY` 설정

### 소셜 미디어 자동화

1. **Twitter/X API**
   - Developer 계정 생성
   - API v2 액세스 권한
   
2. **Facebook API**
   - 페이지 액세스 토큰 생성

### 이메일 마케팅

- **SMTP 설정**: Gmail App Password 또는 다른 이메일 서비스

### 제휴 마케팅

- **Amazon Associates**: 승인 후 태그 설정
- **Impact Radius, Commission Junction, ShareASale**: 각 프로그램별 ID

## 📊 API 엔드포인트

### 콘텐츠 관리
- `GET /api/articles` - 기사 목록 조회
- `POST /api/content-generation` - AI 콘텐츠 생성
- `POST /api/publishing` - 자동 발행

### 분석 및 최적화
- `GET /api/analytics` - 성과 분석 데이터
- `GET /api/revenue` - 수익 분석
- `POST /api/affiliate` - 제휴 링크 추적

### 환경 데이터
- `GET /api/environmental-data` - 환경 데이터 조회

## 🎯 자동화 스케줄

### 일일 자동화
- **06:00**: RSS 피드 수집
- **09:00**: AI 기사 생성 및 발행
- **12:00**: 소셜 미디어 공유
- **18:00**: 성과 분석 및 최적화

### 주간 자동화
- **월요일**: 주간 뉴스레터 발송
- **수요일**: A/B 테스트 결과 분석
- **금요일**: 제휴 마케팅 성과 리뷰

## 🔍 모니터링

### 실시간 대시보드
- 방문자 통계
- 수익 현황
- 콘텐츠 성과
- 시스템 상태

### 알림 설정
- 시스템 오류 알림
- 성과 임계값 알림
- 수익 목표 달성 알림

## 📈 수익 최적화

### AdSense 최적화
- 자동 광고 배치 최적화
- RPM 성과 추적
- Core Web Vitals 모니터링

### 제휴 마케팅
- 클릭/전환 추적
- 프로그램별 성과 분석
- 계절별 전략 자동 조정

### SEO 최적화
- 키워드 자동 최적화
- 메타 태그 생성
- 구조화된 데이터 적용

## 🚨 문제 해결

### 일반적인 문제

1. **API 키 오류**
   - `.env.local` 파일 확인
   - API 키 유효성 검증

2. **데이터베이스 연결 오류**
   - Prisma 설정 확인
   - `npx prisma generate` 재실행

3. **콘텐츠 생성 실패**
   - OpenAI API 크레딧 확인
   - 폴백 모드 활용

4. **소셜 미디어 공유 실패**
   - API 권한 확인
   - 토큰 만료 여부 점검

### 로그 확인

```bash
# 시스템 로그 확인
tail -f logs/system.log

# 수익 추적 로그
tail -f logs/revenue.log

# 오류 로그
tail -f logs/error.log
```

## 📞 지원

시스템 관련 문의나 문제가 발생하면:

1. 먼저 로그를 확인하세요
2. 해당 테스트 스크립트를 실행해보세요
3. 환경 변수 설정을 다시 확인하세요

## 🎉 성공 지표

### Phase 1-5 완료 확인
- ✅ 모든 테스트 스크립트 정상 실행
- ✅ Google Analytics 데이터 수집
- ✅ AdSense 광고 표시
- ✅ 자동 콘텐츠 생성 및 발행
- ✅ 제휴 링크 추적 동작
- ✅ 실시간 수익 대시보드 작동

시스템이 정상적으로 작동하면 Google AdSense 승인 신청 및 본격적인 운영을 시작할 수 있습니다!