# Wat밥(Watbab) – 오늘 뭐 먹지? 뷔페 정보 서비스

**Wat밥**은 사용자의 위치와 관심 지역에 따라 다양한 뷔페 정보를 탐색할 수 있는 웹 서비스입니다.  
"오늘 뭐 먹지?"라는 고민을 해결하고, 전국의 뷔페를 한눈에 비교·검색할 수 있게 도와줍니다.

🌐 **라이브 서비스**: [https://watbab.vercel.app](https://watbab.vercel.app)

---

## ✨ 주요 기능

### 🗺️ 지역별 뷔페 탐색
- 서울, 경기, 부산, 대구, 광주, 대전, 울산, 인천, 강원, 충청, 전라, 경상, 제주 등 전국 주요 지역별 뷔페 정보 제공
- 지역 선택을 통한 맞춤형 뷔페 리스트 표시

### 🔍 스마트 검색 기능
- 뷔페명 실시간 검색
- 빠른 필터링으로 원하는 뷔페 즉시 찾기

### 📍 상세 정보 & 지도
- 각 뷔페의 상세 정보 (주소, 특징, 메뉴 등)
- Kakao Map 연동을 통한 위치 확인
- 오늘의 메뉴 이미지 및 설명

### 👤 사용자 인증
- Google OAuth 2.0 기반 소셜 로그인
- 사용자 프로필 관리
- 세션 기반 인증 시스템

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 사용자 경험
- Progressive Web App (PWA) 지원

### 📈 SEO & 분석
- Google Analytics 통합 (추적 ID: G-FS2PFSC6CP)
- Open Graph 메타 태그로 소셜 미디어 최적화
- 검색 엔진 최적화 (Google, Naver 사이트 인증)
- Google AdSense 광고 통합

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: SvelteKit 2.16.0 + Svelte 5.0.0
- **Language**: TypeScript 5.0.0
- **Build Tool**: Vite 6.2.6
- **Styling**: Vanilla CSS (반응형 디자인)

### Backend & Services
- **API**: Java 기반 REST API (외부 서비스)
- **Authentication**: Google OAuth 2.0
- **Maps**: Kakao Map JavaScript API
- **Analytics**: Google Analytics 4
- **Monetization**: Google AdSense

### Deployment & Infrastructure
- **Platform**: Vercel
- **Adapter**: @sveltejs/adapter-vercel
- **Domain**: watbab.vercel.app

### Development Tools
- **Package Manager**: npm
- **Type Checking**: svelte-check
- **Code Quality**: TypeScript strict mode

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/socra710/tood.git
   cd tood
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   `.env` 파일을 생성하고 다음 변수들을 설정하세요:
   ```env
   # API 서버 URL
   VITE_API_URL=your_java_api_server_url
   
   # Google OAuth 2.0
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   
   # Kakao Map API
   VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
   VITE_KAKAO_REST_JAVASCRIPT_KEY=your_kakao_javascript_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   브라우저에서 http://localhost:5173 접속

5. **프로덕션 빌드**
   ```bash
   npm run build
   npm run preview
   ```

### 환경 변수 상세 설명

| 변수명 | 설명 | 필수 여부 |
|--------|------|----------|
| `VITE_API_URL` | Java REST API 서버 주소 | ✅ 필수 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | ✅ 필수 |
| `VITE_KAKAO_REST_API_KEY` | Kakao REST API 키 | ✅ 필수 |
| `VITE_KAKAO_REST_JAVASCRIPT_KEY` | Kakao JavaScript API 키 | ✅ 필수 |

---

## 📝 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# TypeScript 타입 체크
npm run check

# TypeScript 타입 체크 (watch 모드)
npm run check:watch

# SvelteKit 동기화
npm run prepare
```

---

## 🏗️ 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 Svelte 컴포넌트
│   ├── Header.svelte    # 헤더 + 사용자 인증
│   ├── Footer.svelte    # 푸터
│   ├── BuffetCard.svelte # 뷔페 카드 컴포넌트
│   ├── LoadingBar.svelte # 로딩 바
│   └── RegionSelector.svelte # 지역 선택기
├── routes/              # SvelteKit 라우팅
│   ├── +page.svelte    # 메인 페이지
│   ├── api/            # API 엔드포인트
│   │   ├── login/      # Google OAuth 로그인
│   │   ├── logout/     # 로그아웃
│   │   └── me/         # 사용자 정보
│   ├── tood/[id]/      # 뷔페 상세 페이지
│   └── sitemap.xml/    # SEO용 사이트맵
├── lib/                # 유틸리티 및 공통 코드
└── app.html            # HTML 템플릿
static/                 # 정적 파일
├── favicon.png
├── og-image.png        # Open Graph 이미지
├── robots.txt          # 검색 엔진 크롤러 설정
└── ads.txt             # Google AdSense 설정
```

---

## 🔧 API 연동

이 프로젝트는 외부 Java REST API와 연동됩니다. API 서버는 다음 엔드포인트를 제공해야 합니다:

### 주요 API 엔드포인트

- `GET /buffets` - 전체 뷔페 목록 조회
- `GET /tood?Id={id}` - 특정 뷔페 상세 정보 조회
- `POST /user/upsert` - 사용자 정보 생성/업데이트

### API 응답 형식

```json
{
  "success": "true",
  "message": "성공",
  "data": [...] // 실제 데이터
}
```

---

## 🎨 사용법

### 일반 사용자
1. **지역 선택**: 상단 지역 셀렉터에서 원하는 지역을 선택
2. **뷔페 검색**: 검색창에 뷔페명을 입력하여 실시간 검색
3. **상세 정보**: 뷔페 카드를 클릭하여 상세 정보 및 지도 확인
4. **로그인**: Google 계정으로 로그인하여 개인화된 서비스 이용

### 개발자
- 컴포넌트 기반 아키텍처로 유지보수성 향상
- TypeScript로 타입 안정성 보장
- Vite 빌드 시스템으로 빠른 개발 경험
- Vercel을 통한 간편한 배포

---

## 🚀 배포

### Vercel 자동 배포
이 프로젝트는 Vercel에 자동 배포되도록 설정되어 있습니다.

1. **GitHub 연동**: 코드 푸시 시 자동 빌드 및 배포
2. **환경 변수**: Vercel 대시보드에서 환경 변수 설정
3. **도메인**: 자동으로 `watbab.vercel.app` 도메인 할당

### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel --prod
```

---

## 📊 분석 및 모니터링

### Google Analytics
- **추적 ID**: G-FS2PFSC6CP
- 페이지 뷰, 사용자 행동, 전환율 추적
- 실시간 사용자 모니터링

### 검색 엔진 최적화
- **Google Search Console**: 검색 성능 모니터링
- **Naver 웹마스터도구**: 네이버 검색 최적화
- **사이트맵**: 자동 생성되는 XML 사이트맵

---

## 🤝 기여하기

### 개발 참여
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코드 스타일
- TypeScript strict mode 준수
- Svelte 5 Composition API 사용
- 컴포넌트명은 PascalCase
- 파일명은 kebab-case

---

## 📞 연락처 및 지원

### 비즈니스 문의
- **뷔페 등록/프로모션/광고 문의**: socra710@naver.com
- **파트너십 문의**: socra710@naver.com

### 기술 지원
- **버그 제보**: [GitHub Issues](https://github.com/socra710/tood/issues)
- **기능 제안**: [GitHub Issues](https://github.com/socra710/tood/issues)
- **질문 및 토론**: [GitHub Discussions](https://github.com/socra710/tood/discussions)

---

## 📄 라이센스

이 프로젝트는 개인 프로젝트로, 모든 권리는 저작권자에게 있습니다.

© 2025 Wat밥(Watbab) All rights reserved.

---

## 🔗 관련 링크

- [라이브 서비스](https://watbab.vercel.app)
- [GitHub Repository](https://github.com/socra710/tood)
- [Issues & Bug Reports](https://github.com/socra710/tood/issues)

---

<div align="center">
  <strong>🍽️ 오늘 뭐 먹지? Wat밥에서 해결하세요! 🍽️</strong>
</div>