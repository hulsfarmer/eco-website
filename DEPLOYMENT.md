# 🚀 Render.com 배포 가이드

## 1. Render.com 계정 설정

1. [Render.com](https://render.com)에서 계정 생성
2. GitHub 계정 연결

## 2. PostgreSQL 데이터베이스 생성

1. Render 대시보드에서 "New +"를 클릭
2. "PostgreSQL" 선택
3. 설정:
   - **Name**: `eco-website-db`
   - **Plan**: Free
   - **PostgreSQL Version**: 15
4. "Create Database" 클릭
5. 생성 후 **Internal Database URL** 복사 (postgres://...)

## 3. Web Service 생성

1. Render 대시보드에서 "New +"를 클릭
2. "Web Service" 선택
3. GitHub repository 연결: `https://github.com/hulsfarmer/eco-website`
4. 설정:
   - **Name**: `eco-website`
   - **Environment**: Node
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: (비워둠)
   - **Build Command**: `npm ci && npm run build && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`

## 4. 환경 변수 설정

Environment Variables 섹션에서 다음 변수들 추가:

### 필수 변수
```
NODE_ENV=production
DATABASE_URL=postgresql://[위에서 복사한 Internal Database URL]
OPENAI_API_KEY=sk-proj-[당신의 OpenAI API 키]
NEXTAUTH_SECRET=rC8D7RQme4XMm7wFGcrZ6zYVSgFOeJT/Jn1BG9lHD2o=
NEXTAUTH_URL=https://eco-website.onrender.com
NEXT_PUBLIC_SITE_URL=https://eco-website.onrender.com
```

### Google 서비스 (선택사항)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxx
```

## 5. 배포 실행

1. "Create Web Service" 클릭
2. 자동 빌드 및 배포 시작
3. 완료 후 `https://eco-website.onrender.com`에서 접속 가능

## 6. 데이터베이스 초기화

배포 완료 후 자동으로 데이터베이스 테이블이 생성됩니다:
- Prisma가 자동으로 스키마를 적용
- 첫 번째 방문 시 AI 콘텐츠 생성 시작

## 7. 확인 사항

✅ 웹사이트 접속: https://eco-website.onrender.com  
✅ AI 콘텐츠 생성: /api/ai-content  
✅ 기사 목록 확인: /api/articles  
✅ 모든 페이지 동작 확인  

## 주의사항

- **Free Plan**: 비활성 시 자동 슬립 (30분 후)
- **Database**: PostgreSQL Free (1GB 제한)
- **Build Time**: 초기 빌드 5-10분 소요
- **Cold Start**: 슬립 후 첫 접속 시 지연 발생

## 업그레이드 옵션

더 나은 성능을 위해서는:
- **Starter Plan**: $7/월 (항상 활성, 더 빠른 성능)
- **Pro Plan**: $25/월 (더 많은 리소스, SLA 보장)