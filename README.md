# 🚀 권현석(Kwon Hyeon Seok) 반응형 포트폴리오 웹사이트

외부 라이브러리(Bootstrap, jQuery, React 등) 없이 **순수 HTML5, CSS3, JavaScript (ES6+)**만으로 처음부터 직접 제작한 반응형 포트폴리오 웹사이트입니다.

- **배포 URL (GitHub Pages)**: [https://wp230.github.io/codyssey-b1-1/](https://wp230.github.io/codyssey-b1-1/)
- **저장소 URL**: [https://github.com/wp230/codyssey-b1-1](https://github.com/wp230/codyssey-b1-1)

---

## 📌 주요 기능 & 요구사항 구현 목록

### 1. 시맨틱 마크업 (Semantic HTML5)
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 등 시맨틱 태그만을 사용하여 웹 표준 및 검색엔진 최적화(SEO), 웹 접근성을 준수했습니다.
- 프로필 이미지의 `alt` 속성 및 Contact 폼 `<label for="...">` - `<input id="...">` 1:1 매칭 완료.

### 2. 레이아웃 & 반응형 디자인 (CSS3)
- **데스크톱 좌측 고정 사이드바**: 가로 992px 이상에서 280px 너비의 고정 사이드바로 전환 (ScrollSpy 내장)
- **모바일 상단 헤더**: 모바일 화면에서 상단 가로 바(60px)로 전환되며 햄버거 메뉴 제공
- **CSS Grid**: Projects & Skills 카드 영역 (`repeat(auto-fit, minmax(280px, 1fr))`로 자동 반응형 격자 배치)
- **CSS 변수 (`:root`)**: 다크모드/라이트모드 디자인 시스템 변수화
- **Mobile-First 반응형**: 브레이크포인트 `768px` (태블릿), `992px` (데스크톱)

### 3. 인터랙티브 UI & DOM 조작 (JavaScript ES6+)
- **다크 모드 플로팅 버튼**: 화면 우측 하단 플로팅 액션 버튼(FAB)으로 테마 상태 전환 + `localStorage` 영구 보존
- **햄버거 메뉴**: 모바일 환경 메뉴 토글 (`classList.toggle('active')`)
- **부드러운 스크롤 & 스크롤 탑 버튼**: 스크롤 `300px` 이상 시 우측 하단에 `↑` 버튼 출현 및 최상단 이동
- **ScrollSpy (Intersection Observer)**: 현재 보고 있는 섹션을 감지하여 사이드바 메뉴 자동 하이라이트

### 4. 비동기 GitHub API 연동 (Async/Await)
- Endpoint: `https://api.github.com/users/wp230/repos`
- **4가지 UI 상태 처리**:
  1. ⏳ **로딩 상태**: 데이터 요청 중 로딩 스피너 표시
  2. ✅ **성공 상태**: `array.map()`과 템플릿 리터럴로 프로젝트 카드 동적 렌더링
  3. ⚠️ **에러 상태**: 레이트 리밋(403) 또는 네트워크 실패 시 에러 메시지 및 `[다시 시도]` 버튼 제공
  4. 📭 **빈 상태**: 공개 저장소가 없을 경우 안내 메시지 렌더링

### 5. Contact 폼 유효성 검사 (Form UX)
- `event.preventDefault()`로 폼 기본 제출 동작 방지
- 이름 필수 검증, 이메일 정규식 검증, 메시지 필수 검증
- 입력 필드 하단 에러 메시지 렌더링 및 제출 성공 메세지 표시

---

## 🔄 상태 관리 패턴 (이벤트 → 상태 변경 → DOM 렌더링)

본 프로젝트는 React의 핵심 개념인 **"상태 주도 렌더링"**을 순수 자바스크립트로 직접 구현하였습니다:

1. **테마 상태 관리**:
   - `[이벤트]` 우측 하단 플로팅 버튼 클릭
   - `[상태 변경]` `currentTheme = 'dark'` 갱신 및 `localStorage.setItem('theme', 'dark')`
   - `[DOM 업데이트]` `document.documentElement.setAttribute('data-theme', 'dark')` 적용 및 버튼 아이콘 ☀️로 변경

2. **비동기 API 상태 관리**:
   - `[이벤트]` 페이지 로드 시 또는 [다시 시도] 버튼 클릭 시
   - `[상태 변경]` `loading` ➔ API 응답 결과에 따라 `success` / `error` / `empty` 상태 전환
   - `[DOM 업데이트]` 상태별 UI 템플릿(스피너 / 프로젝트 카드 리스트 / 재시도 박스)을 `#projects-container`에 주입

3. **폼 유효성 상태 관리**:
   - `[이벤트]` 폼 submit 이벤트 발생
   - `[상태 변경]` 입력값 검증 후 `isValid` 플래그 및 필드별 에러 상태 결정
   - `[DOM 업데이트]` 에러 필드 하단에 경고 텍스트 노출 또는 성공 메시지 출력 및 폼 초기화

---

## ⚙️ 주요 스크롤 및 감지 설정값 기준 (Requirements)

| 기능 | 설정값 기준 | 설명 |
| :--- | :--- | :--- |
| **스크롤 탑 버튼 표시** | `300px` | 스크롤 300px 이상 시 우측 하단 `↑` 버튼 출현 |
| **ScrollSpy 섹션 감지** | `rootMargin: '-20% 0px -60% 0px'` | 뷰포트 진입 시 해당 섹션 메뉴 하이라이트 |

---

## 🛠️ 기술 스택 (Tech Stack)

- **Language**: HTML5, CSS3, JavaScript (ES6+)
- **Library/Framework**: 없음 (Vanilla Web Only)
- **Deployment**: GitHub Pages

---

&copy; 2026 권현석 (Kwon Hyeon Seok). All rights reserved.
